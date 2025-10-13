/**
 * Centralized fetcher utility for API calls
 * Handles JSON parsing, error handling, and authorization
 */

/**
 * Get the base URL for API calls
 * In production (Vercel), use the backend URL from environment variable
 * In development, use localhost backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Default configuration for fetch requests
 */
const defaultConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

/**
 * Main fetcher function that wraps fetch with JSON handling and error parsing
 * @param {string} url - The URL to fetch (will be prefixed with API_BASE_URL if relative)
 * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Parsed JSON response
 * @throws {ApiError} When the response is not ok
 */
export async function fetcher(url, options = {}) {
    // If URL is relative, prepend the API base URL
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const config = {
        ...defaultConfig,
        ...options,
        headers: {
            ...defaultConfig.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(fullUrl, config);

        // Parse response body (if exists)
        let data = null;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else if (contentType?.includes('text/')) {
            data = await response.text();
        }

        // Handle error responses
        if (!response.ok) {
            const errorMessage =
                data?.message ||
                data?.error ||
                `HTTP ${response.status}: ${response.statusText}`;
            throw new ApiError(errorMessage, response.status, data);
        }

        return data;
    } catch (error) {
        // Re-throw ApiError as-is
        if (error instanceof ApiError) {
            throw error;
        }

        // Wrap network errors or other errors
        throw new ApiError(
            error.message || 'An unexpected error occurred',
            error.status || 500,
            null,
        );
    }
}

/**
 * GET request helper
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Additional fetch options
 * @returns {Promise<any>}
 */
export function get(url, options = {}) {
    return fetcher(url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 * @param {string} url - The URL to fetch
 * @param {any} body - Request body (will be JSON stringified)
 * @param {RequestInit} options - Additional fetch options
 * @returns {Promise<any>}
 */
export function post(url, body, options = {}) {
    return fetcher(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * PUT request helper
 * @param {string} url - The URL to fetch
 * @param {any} body - Request body (will be JSON stringified)
 * @param {RequestInit} options - Additional fetch options
 * @returns {Promise<any>}
 */
export function put(url, body, options = {}) {
    return fetcher(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * PATCH request helper
 * @param {string} url - The URL to fetch
 * @param {any} body - Request body (will be JSON stringified)
 * @param {RequestInit} options - Additional fetch options
 * @returns {Promise<any>}
 */
export function patch(url, body, options = {}) {
    return fetcher(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request helper
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Additional fetch options
 * @returns {Promise<any>}
 */
export function del(url, options = {}) {
    return fetcher(url, { ...options, method: 'DELETE' });
}

/**
 * Build query string from params object
 * @param {Object} params - Query parameters
 * @returns {string} Query string (e.g., "?page=1&limit=10")
 */
export function buildQueryString(params) {
    if (!params || Object.keys(params).length === 0) return '';

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}
