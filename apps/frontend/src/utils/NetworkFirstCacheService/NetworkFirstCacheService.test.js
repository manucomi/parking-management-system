import NetworkFirstCacheService from './NetworkFirstCacheService';

describe('NetworkFirstCacheService', () => {
    let service;
    let mockLogger;

    beforeEach(() => {
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        };

        service = new NetworkFirstCacheService({
            logger: mockLogger,
            timeout: 1000,
            logCacheOperations: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('constructor', () => {
        it('should initialize with default options', () => {
            const defaultService = new NetworkFirstCacheService();
            const stats = defaultService.getCacheStats();

            expect(stats.timeout).toBe(5000);
            expect(stats.size).toBe(0);
        });

        it('should initialize with custom options', () => {
            const customService = new NetworkFirstCacheService({
                logger: mockLogger,
                timeout: 2000,
                logCacheOperations: false,
            });

            const stats = customService.getCacheStats();
            expect(stats.timeout).toBe(2000);
        });

        it('should use console as default logger', () => {
            const defaultService = new NetworkFirstCacheService();
            expect(defaultService.logger).toBe(console);
        });
    });

    describe('wrap()', () => {
        it('should return network data and cache it on successful request', async () => {
            const mockData = { id: 1, name: 'test' };
            const asyncFunction = jest.fn().mockResolvedValue(mockData);

            const result = await service.wrap('testKey', asyncFunction);

            expect(result).toEqual(mockData);
            expect(asyncFunction).toHaveBeenCalledTimes(1);
            expect(service.cache.get('testKey')).toEqual(mockData);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'Cache updated with fresh data',
                { key: 'testKey' }
            );
        });

        it('should return cached data when network request fails', async () => {
            const cachedData = { id: 1, name: 'cached' };
            const networkError = new Error('Network failed');

            // First, populate the cache
            service.cache.set('testKey', cachedData);

            const asyncFunction = jest.fn().mockRejectedValue(networkError);

            const result = await service.wrap('testKey', asyncFunction);

            expect(result).toEqual(cachedData);
            expect(asyncFunction).toHaveBeenCalledTimes(1);
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Network request failed, checking cache',
                { key: 'testKey', error: 'Network failed' }
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                'Returning cached data',
                { key: 'testKey' }
            );
        });

        it('should throw error when network fails and no cache exists', async () => {
            const networkError = new Error('Network failed');
            const asyncFunction = jest.fn().mockRejectedValue(networkError);

            await expect(
                service.wrap('testKey', asyncFunction)
            ).rejects.toThrow('Network failed');

            expect(asyncFunction).toHaveBeenCalledTimes(1);
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Network request failed, checking cache',
                { key: 'testKey', error: 'Network failed' }
            );
        });

        it('should update cache with new network data when cache exists', async () => {
            const cachedData = { id: 1, name: 'cached' };
            const networkData = { id: 1, name: 'network' };

            // First, populate the cache
            service.cache.set('testKey', cachedData);

            const asyncFunction = jest.fn().mockResolvedValue(networkData);

            const result = await service.wrap('testKey', asyncFunction);

            expect(result).toEqual(networkData);
            expect(service.cache.get('testKey')).toEqual(networkData);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'Cache updated with fresh data',
                { key: 'testKey' }
            );
        });

        it('should not log when logCacheOperations is false', async () => {
            const silentService = new NetworkFirstCacheService({
                logger: mockLogger,
                logCacheOperations: false,
            });

            const mockData = { id: 1, name: 'test' };
            const asyncFunction = jest.fn().mockResolvedValue(mockData);

            await silentService.wrap('testKey', asyncFunction);

            expect(mockLogger.info).not.toHaveBeenCalled();
            expect(mockLogger.warn).not.toHaveBeenCalled();
        });
    });

    describe('executeWithTimeout()', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should resolve when function completes within timeout', async () => {
            const mockData = { result: 'success' };
            const asyncFunction = jest.fn().mockResolvedValue(mockData);

            const promise = service.executeWithTimeout(asyncFunction);

            // Fast-forward time but not past timeout
            jest.advanceTimersByTime(500);

            const result = await promise;
            expect(result).toEqual(mockData);
            expect(asyncFunction).toHaveBeenCalledTimes(1);
        });

        it('should reject with TimeoutError when function takes too long', async () => {
            const slowFunction = jest.fn(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => resolve('slow result'), 2000);
                    })
            );

            const promise = service.executeWithTimeout(slowFunction);

            // Fast-forward past timeout
            jest.advanceTimersByTime(1001);

            await expect(promise).rejects.toThrow(
                'Operation timed out after 1000ms'
            );

            const error = await promise.catch((e) => e);
            expect(error.name).toBe('TimeoutError');
        });

        it('should reject with original error when function fails within timeout', async () => {
            const error = new Error('Function failed');
            const failingFunction = jest.fn().mockRejectedValue(error);

            const promise = service.executeWithTimeout(failingFunction);

            // Fast-forward time but not past timeout
            jest.advanceTimersByTime(500);

            await expect(promise).rejects.toThrow('Function failed');
            expect(failingFunction).toHaveBeenCalledTimes(1);
        });

        it('should handle synchronous functions', async () => {
            const syncFunction = jest.fn().mockReturnValue('sync result');

            const result = await service.executeWithTimeout(syncFunction);

            expect(result).toBe('sync result');
            expect(syncFunction).toHaveBeenCalledTimes(1);
        });
    });

    describe('clearCache()', () => {
        it('should clear all cached data', () => {
            service.cache.set('key1', 'value1');
            service.cache.set('key2', 'value2');
            expect(service.getCacheStats().size).toBe(2);

            service.clearCache();

            expect(service.getCacheStats().size).toBe(0);
            expect(service.cache.get('key1')).toBeUndefined();
            expect(service.cache.get('key2')).toBeUndefined();
            expect(mockLogger.info).toHaveBeenCalledWith('Cache cleared');
        });

        it('should not log when logCacheOperations is false', () => {
            const silentService = new NetworkFirstCacheService({
                logger: mockLogger,
                logCacheOperations: false,
            });

            silentService.clearCache();

            expect(mockLogger.info).not.toHaveBeenCalled();
        });
    });

    describe('getCacheStats()', () => {
        it('should return correct cache statistics', () => {
            service.cache.set('key1', 'value1');
            service.cache.set('key2', 'value2');

            const stats = service.getCacheStats();

            expect(stats).toEqual({
                size: 2,
                timeout: 1000,
            });
        });

        it('should return zero size for empty cache', () => {
            const stats = service.getCacheStats();

            expect(stats).toEqual({
                size: 0,
                timeout: 1000,
            });
        });
    });

    describe('integration scenarios', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should handle multiple concurrent requests for same key', async () => {
            const mockData = { id: 1, name: 'test' };
            let callCount = 0;
            const asyncFunction = jest.fn(() => {
                callCount += 1;
                return Promise.resolve({ ...mockData, call: callCount });
            });

            // Start multiple concurrent requests
            const promise1 = service.wrap('sameKey', asyncFunction);
            const promise2 = service.wrap('sameKey', asyncFunction);
            const promise3 = service.wrap('sameKey', asyncFunction);

            const [result1, result2, result3] = await Promise.all([
                promise1,
                promise2,
                promise3,
            ]);

            // Each call should succeed with network data
            expect(result1).toEqual({ ...mockData, call: 1 });
            expect(result2).toEqual({ ...mockData, call: 2 });
            expect(result3).toEqual({ ...mockData, call: 3 });
            expect(asyncFunction).toHaveBeenCalledTimes(3);
        });

        it('should handle timeout followed by successful request', async () => {
            const cachedData = { id: 1, name: 'cached' };
            const networkData = { id: 1, name: 'network' };

            // Set up initial cache
            service.cache.set('testKey', cachedData);

            // First request times out
            const slowFunction = jest.fn(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => resolve(networkData), 2000);
                    })
            );

            const timeoutPromise = service.wrap('testKey', slowFunction);
            jest.advanceTimersByTime(1001);

            const timeoutResult = await timeoutPromise;
            expect(timeoutResult).toEqual(cachedData); // Should return cached data

            // Second request succeeds quickly
            const fastFunction = jest.fn().mockResolvedValue(networkData);
            const successResult = await service.wrap('testKey', fastFunction);

            expect(successResult).toEqual(networkData);
            expect(service.cache.get('testKey')).toEqual(networkData); // Cache should be updated
        });
    });
});
