import SimpleCache from './SimpleCache';

/**
 * A simple network-first cache utility that can wrap any async function.
 * Caches successful responses forever until replaced by newer successful responses.
 * Only updates cache when requests are successful and complete within the timeout.
 *
 * ⚠️  MEMORY USAGE WARNING: The cache stores a maximum of 100 items with unique keys.
 * When this limit is exceeded, the least recently used items are automatically evicted.
 * Consider the memory implications when caching large objects or using many unique cache keys.
 */
export default class NetworkFirstCacheService {
    constructor(options = {}) {
        this.cache = new SimpleCache();
        this.logger = options.logger || console;
        this.timeout = options.timeout || 5000;
        this.logCacheOperations =
            options.logCacheOperations !== undefined
                ? options.logCacheOperations
                : true;
    }

    /**
     * Wrap any async function with network-first caching
     * @param {string} cacheKey - Key for caching the result
     * @param {Function} asyncFunction - The async function to execute and cache
     * @returns {Promise<*>} The result from network or cache
     */
    async wrap(cacheKey, asyncFunction) {
        // Check if we have cached data first
        const hasCachedData = this.cache.has(cacheKey);

        try {
            // Only apply timeout if we have cached data to fall back to
            const result = hasCachedData
                ? await this.executeWithTimeout(asyncFunction)
                : await asyncFunction();

            // Cache the successful result (replaces any existing cached value)
            this.cache.set(cacheKey, result);

            if (this.logCacheOperations) {
                this.logger.info('Cache updated with fresh data', {
                    key: cacheKey,
                });
            }

            return result;
        } catch (error) {
            if (this.logCacheOperations) {
                this.logger.warn('Network request failed, checking cache', {
                    key: cacheKey,
                    error: error.message,
                });
            }

            // Check if we have cached data
            const cachedData = this.cache.get(cacheKey);
            if (cachedData !== undefined) {
                if (this.logCacheOperations) {
                    this.logger.info('Returning cached data', {
                        key: cacheKey,
                    });
                }

                return cachedData;
            }

            // No cache available, re-throw the error
            throw error;
        }
    }

    /**
     * Execute a function with a timeout
     * @param {Function} fn - Function to execute
     * @returns {Promise<*>} Result of the function
     * @throws {Error} TimeoutError if the function takes too long
     */
    async executeWithTimeout(fn) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                const error = new Error(
                    `Operation timed out after ${this.timeout}ms`
                );
                error.name = 'TimeoutError';
                reject(error);
            }, this.timeout);

            Promise.resolve(fn())
                .then((result) => {
                    clearTimeout(timeoutId);
                    resolve(result);
                })
                .catch((error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                });
        });
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
        if (this.logCacheOperations) {
            this.logger.info('Cache cleared');
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size(),
            timeout: this.timeout,
        };
    }
}
