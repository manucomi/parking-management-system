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
                    }
                }
            } catch (err) {
                console.error(
                    '[useResilientData] Error loading from localStorage:',
                    err,
                );
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
        setIsLoading(true);
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
            setError(err.message);

            // If we have data (from cache), keep showing it
            if (data) {
                setIsStale(true);
                console.log(
                    '[useResilientData] Using cached data due to fetch failure',
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-refresh on mount if data is stale or missing
    useEffect(() => {
        if (isStale || !data) {
            refresh();
        }
    }, []); // Only on mount

    return {
        data,
        isLoading,
        isStale,
        error,
        refresh,
    };
}
