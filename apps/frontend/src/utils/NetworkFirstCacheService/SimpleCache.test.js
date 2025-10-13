import SimpleCache from './SimpleCache';

describe('SimpleCache', () => {
    let cache;

    beforeEach(() => {
        cache = new SimpleCache();
    });

    describe('constructor', () => {
        it('should initialize with an empty cache', () => {
            expect(cache.size()).toBe(0);
        });

        it('should use default maxSize of 100', () => {
            expect(cache.getMaxSize()).toBe(100);
        });

        it('should accept custom maxSize', () => {
            const customCache = new SimpleCache(50);
            expect(customCache.getMaxSize()).toBe(50);
        });

        it('should throw error for non-positive maxSize', () => {
            expect(() => new SimpleCache(0)).toThrow(
                'maxSize must be a positive number'
            );
            expect(() => new SimpleCache(-1)).toThrow(
                'maxSize must be a positive number'
            );
        });
    });

    describe('set() and get()', () => {
        it('should store and retrieve a string value', () => {
            cache.set('testKey', 'testValue');
            expect(cache.get('testKey')).toBe('testValue');
        });

        it('should store and retrieve an object value', () => {
            const testObject = { id: 1, name: 'test' };
            cache.set('objectKey', testObject);
            expect(cache.get('objectKey')).toEqual(testObject);
        });

        it('should store and retrieve an array value', () => {
            const testArray = [1, 2, 3, 'test'];
            cache.set('arrayKey', testArray);
            expect(cache.get('arrayKey')).toEqual(testArray);
        });

        it('should store and retrieve null values', () => {
            cache.set('nullKey', null);
            expect(cache.get('nullKey')).toBeNull();
        });

        it('should store and retrieve undefined values', () => {
            cache.set('undefinedKey', undefined);
            expect(cache.get('undefinedKey')).toBeUndefined();
        });

        it('should return undefined for non-existent keys', () => {
            expect(cache.get('nonExistentKey')).toBeUndefined();
        });

        it('should overwrite existing values', () => {
            cache.set('key', 'oldValue');
            cache.set('key', 'newValue');
            expect(cache.get('key')).toBe('newValue');
        });
    });

    describe('has()', () => {
        it('should return true for existing keys', () => {
            cache.set('existingKey', 'value');
            expect(cache.has('existingKey')).toBe(true);
        });

        it('should return false for non-existent keys', () => {
            expect(cache.has('nonExistentKey')).toBe(false);
        });

        it('should return true for keys with null values', () => {
            cache.set('nullKey', null);
            expect(cache.has('nullKey')).toBe(true);
        });

        it('should return true for keys with undefined values', () => {
            cache.set('undefinedKey', undefined);
            expect(cache.has('undefinedKey')).toBe(true);
        });
    });

    describe('delete()', () => {
        it('should remove an existing key', () => {
            cache.set('keyToDelete', 'value');
            expect(cache.has('keyToDelete')).toBe(true);

            cache.delete('keyToDelete');
            expect(cache.has('keyToDelete')).toBe(false);
            expect(cache.get('keyToDelete')).toBeUndefined();
        });

        it('should not throw when deleting non-existent keys', () => {
            expect(() => cache.delete('nonExistentKey')).not.toThrow();
        });

        it('should decrease cache size when deleting', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            expect(cache.size()).toBe(2);

            cache.delete('key1');
            expect(cache.size()).toBe(1);
        });
    });

    describe('clear()', () => {
        it('should remove all entries from cache', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');
            expect(cache.size()).toBe(3);

            cache.clear();
            expect(cache.size()).toBe(0);
            expect(cache.has('key1')).toBe(false);
            expect(cache.has('key2')).toBe(false);
            expect(cache.has('key3')).toBe(false);
        });

        it('should work on empty cache', () => {
            expect(() => cache.clear()).not.toThrow();
            expect(cache.size()).toBe(0);
        });
    });

    describe('size()', () => {
        it('should return 0 for empty cache', () => {
            expect(cache.size()).toBe(0);
        });

        it('should return correct size after adding items', () => {
            cache.set('key1', 'value1');
            expect(cache.size()).toBe(1);

            cache.set('key2', 'value2');
            expect(cache.size()).toBe(2);

            cache.set('key3', 'value3');
            expect(cache.size()).toBe(3);
        });

        it('should not increase size when overwriting existing keys', () => {
            cache.set('key', 'value1');
            expect(cache.size()).toBe(1);

            cache.set('key', 'value2');
            expect(cache.size()).toBe(1);
        });

        it('should decrease size when deleting items', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            expect(cache.size()).toBe(2);

            cache.delete('key1');
            expect(cache.size()).toBe(1);

            cache.delete('key2');
            expect(cache.size()).toBe(0);
        });
    });

    describe('getMaxSize()', () => {
        it('should return the maximum size of the cache', () => {
            expect(cache.getMaxSize()).toBe(100);

            const smallCache = new SimpleCache(10);
            expect(smallCache.getMaxSize()).toBe(10);
        });
    });

    describe('max size enforcement', () => {
        let smallCache;

        beforeEach(() => {
            smallCache = new SimpleCache(3);
        });

        it('should evict oldest entries when maxSize is exceeded', () => {
            // Add items up to the limit
            smallCache.set('key1', 'value1');
            smallCache.set('key2', 'value2');
            smallCache.set('key3', 'value3');
            expect(smallCache.size()).toBe(3);

            // Add one more, should evict the oldest (key1)
            smallCache.set('key4', 'value4');
            expect(smallCache.size()).toBe(3);
            expect(smallCache.has('key1')).toBe(false);
            expect(smallCache.has('key2')).toBe(true);
            expect(smallCache.has('key3')).toBe(true);
            expect(smallCache.has('key4')).toBe(true);
        });

        it('should maintain LRU order when accessing existing items', () => {
            smallCache.set('key1', 'value1');
            smallCache.set('key2', 'value2');
            smallCache.set('key3', 'value3');

            // Access key1 to make it recently used
            smallCache.get('key1');

            // Add a new item, should evict key2 (now oldest)
            smallCache.set('key4', 'value4');
            expect(smallCache.has('key1')).toBe(true);
            expect(smallCache.has('key2')).toBe(false);
            expect(smallCache.has('key3')).toBe(true);
            expect(smallCache.has('key4')).toBe(true);
        });

        it('should update LRU order when overwriting existing keys', () => {
            smallCache.set('key1', 'value1');
            smallCache.set('key2', 'value2');
            smallCache.set('key3', 'value3');

            // Overwrite key1 to make it most recently used
            smallCache.set('key1', 'newValue1');

            // Add a new item, should evict key2 (now oldest)
            smallCache.set('key4', 'value4');
            expect(smallCache.has('key1')).toBe(true);
            expect(smallCache.get('key1')).toBe('newValue1');
            expect(smallCache.has('key2')).toBe(false);
            expect(smallCache.has('key3')).toBe(true);
            expect(smallCache.has('key4')).toBe(true);
        });

        it('should handle single item cache correctly', () => {
            const tinyCache = new SimpleCache(1);

            tinyCache.set('key1', 'value1');
            expect(tinyCache.size()).toBe(1);
            expect(tinyCache.has('key1')).toBe(true);

            tinyCache.set('key2', 'value2');
            expect(tinyCache.size()).toBe(1);
            expect(tinyCache.has('key1')).toBe(false);
            expect(tinyCache.has('key2')).toBe(true);
        });

        it('should evict multiple items if necessary', () => {
            // Fill cache to capacity
            smallCache.set('key1', 'value1');
            smallCache.set('key2', 'value2');
            smallCache.set('key3', 'value3');

            // Reduce effective capacity by setting multiple new items
            // This tests the while loop in _evictIfNeeded
            const evenSmallerCache = new SimpleCache(2);
            evenSmallerCache.set('a', '1');
            evenSmallerCache.set('b', '2');
            evenSmallerCache.set('c', '3');
            evenSmallerCache.set('d', '4');

            expect(evenSmallerCache.size()).toBe(2);
            expect(evenSmallerCache.has('a')).toBe(false);
            expect(evenSmallerCache.has('b')).toBe(false);
            expect(evenSmallerCache.has('c')).toBe(true);
            expect(evenSmallerCache.has('d')).toBe(true);
        });
    });
});
