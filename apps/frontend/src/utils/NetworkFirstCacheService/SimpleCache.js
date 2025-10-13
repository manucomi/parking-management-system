/**
 * A simple in-memory cache implementation with size limits.
 * Stores values with LRU (Least Recently Used) eviction when max size is exceeded.
 */
export default class SimpleCache {
    constructor(maxSize = 100) {
        this.cache = new Map();
        this.maxSize = maxSize;

        if (maxSize <= 0) {
            throw new Error('maxSize must be a positive number');
        }
    }

    /**
     * Get a value from the cache
     * @param {string} key - Cache key
     * @returns {*} The cached value or undefined if not found
     */
    get(key) {
        const item = this.cache.get(key);
        if (item) {
            // Move to end to mark as recently used (LRU)
            this.cache.delete(key);
            this.cache.set(key, item);
            return item.value;
        }
        return undefined;
    }

    /**
     * Set a value in the cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     */
    set(key, value) {
        // If key exists, delete it first to update position
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        // Add new entry
        this.cache.set(key, { value });

        // Evict oldest entries if we exceed max size
        this.#evictIfNeeded();
    }

    /**
     * Evict oldest entries if cache size exceeds maxSize
     * @private
     */
    #evictIfNeeded() {
        while (this.cache.size > this.maxSize) {
            // Get the first (oldest) key and delete it
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }

    /**
     * Check if a key exists in the cache
     * @param {string} key - Cache key
     * @returns {boolean} True if key exists
     */
    has(key) {
        return this.cache.has(key);
    }

    /**
     * Delete a key from the cache
     * @param {string} key - Cache key
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get the current size of the cache
     * @returns {number} Number of items in cache
     */
    size() {
        return this.cache.size;
    }

    /**
     * Get the maximum size of the cache
     * @returns {number} Maximum number of items allowed in cache
     */
    getMaxSize() {
        return this.maxSize;
    }
}
