import { useState, useEffect } from 'react';

/**
 * Custom hook for resilient data fetching with multi-level cache fallback
 *
 * Strategy:
 * 1. Show SSR data immediately (from server cache or fresh fetch)
 * 2. If SSR failed, try loading from localStorage (client-side cache)
 * 3. Attempt background refresh with timeout
 * 4. Cache successful responses in localStorage for future visits
 *
 * This ensures users always see data even when backend is sleeping (Render free tier)
 *
 * @param {Object} options - Configuration options
 * @param {*} options.initialData - Data from SSR (getServerSideProps)
 * @param {string} options.cacheKey - Unique key for localStorage cache
 * @param {Function} options.fetchFn - Async function to fetch fresh data
 * @param {number} options.timeout - Max time to wait for fresh data (default 5000ms)
 * @param {number} options.cacheTTL - Time to live for cached data (default 5 minutes)
 * @returns {Object} { data, isLoading, isStale, error, refresh }
 */
export function useResilientData({
    initialData,
    cacheKey,
    fetchFn,
    timeout = 5000,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
}) {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [isStale, setIsStale] = useState(false);
    const [error, setError] = useState(null);
    const [cacheChecked, setCacheChecked] = useState(!!initialData); // Track if we've checked cache

    // Cache initialData from SSR if present
    useEffect(() => {
        if (initialData && typeof window !== 'undefined') {
            try {
                const cacheData = {
                    data: initialData,
                    timestamp: Date.now(),
                };

                console.log('[useResilientData] About to cache:', {
                    key: cacheKey,
                    dataType: Array.isArray(initialData)
                        ? 'array'
                        : typeof initialData,
                    dataLength: Array.isArray(initialData)
                        ? initialData.length
                        : 'N/A',
                });

                localStorage.setItem(cacheKey, JSON.stringify(cacheData));

                // Verify it was saved
                const verification = localStorage.getItem(cacheKey);
                if (verification) {
                    console.log(
                        '[useResilientData] ✅ Cached SSR data in localStorage:',
                        cacheKey,
                    );
                } else {
                    console.error(
                        '[useResilientData] ❌ Failed to verify cache save:',
                        cacheKey,
                    );
                }
            } catch (err) {
                console.error(
                    '[useResilientData] Failed to cache SSR data:',
                    err.name,
                    err.message,
                );
            }
        }
    }, [initialData, cacheKey]);

    // Load from localStorage if SSR data is missing
    useEffect(() => {
        if (!initialData && typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    const { data: cachedData, timestamp } = JSON.parse(cached);
                    const age = Date.now() - timestamp;

                    if (age < cacheTTL) {
                        console.log(
                            `[useResilientData] Loaded from localStorage (${Math.round(age / 1000)}s old)`,
                            cacheKey,
                        );
                        setData(cachedData);
                        setIsStale(true); // Mark as stale to trigger refresh
                        setIsLoading(false);
                    } else {
                        console.log(
                            `[useResilientData] Cache expired (${Math.round(age / 1000)}s old)`,
                            cacheKey,
                        );
                    }
                }
            } catch (err) {
                console.error(
                    '[useResilientData] Error loading from localStorage:',
                    err,
                );
            } finally {
                setCacheChecked(true); // Mark cache as checked
            }
        }
    }, [initialData, cacheKey, cacheTTL]);

    // Fetch fresh data with timeout
    const fetchWithTimeout = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const result = await fetchFn({ signal: controller.signal });
            clearTimeout(timeoutId);
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            throw error;
        }
    };

    // Background refresh
    const refresh = async () => {
        // If we have cached data, don't show loading spinner during background refresh
        const hasExistingData = !!data;

        if (!hasExistingData) {
            setIsLoading(true);
        }
        setError(null);

        try {
            const freshData = await fetchWithTimeout();

            // Update state
            setData(freshData);
            setIsStale(false);
            setError(null);

            // Cache in localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify({
                            data: freshData,
                            timestamp: Date.now(),
                        }),
                    );
                    console.log(
                        '[useResilientData] Cached in localStorage:',
                        cacheKey,
                    );
                } catch (err) {
                    console.warn(
                        '[useResilientData] Failed to cache in localStorage:',
                        err,
                    );
                }
            }
        } catch (err) {
            console.error('[useResilientData] Fetch failed:', err.message);

            // Only set error if we don't have cached data to show
            if (!hasExistingData) {
                setError(err.message);
            } else {
                console.log(
                    '[useResilientData] Keeping cached data despite fetch failure',
                );
            }

            // If we have data (from cache), keep showing it
            if (data) {
                setIsStale(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-refresh on mount if data is stale or missing
    // ONLY after we've checked localStorage
    useEffect(() => {
        if (!cacheChecked) {
            return; // Wait for cache check to complete
        }

        // Only refresh if we truly have no data and we're not already loading
        if (!data && !isLoading) {
            console.log(
                '[useResilientData] No data available, attempting fresh fetch',
                cacheKey,
            );
            refresh();
        }
        // If data is stale (from cache), do a background refresh
        else if (isStale) {
            console.log(
                '[useResilientData] Data is stale, refreshing in background',
                cacheKey,
            );
            refresh();
        }
    }, [cacheChecked]); // Only run when cache check completes

    return {
        data,
        isLoading,
        isStale,
        error,
        refresh,
    };
}

export default useResilientData;
