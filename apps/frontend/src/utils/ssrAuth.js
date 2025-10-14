/**
 * SSR Authentication Utilities
 *
 * Helper functions to extract and use Supabase auth tokens
 * in server-side contexts (getServerSideProps, API routes)
 */

/**
 * Extract Supabase session from cookies
 * @param {string} cookieString - Raw cookie string from req.headers.cookie
 * @returns {Object|null} - Parsed session object or null
 */
export function getSupabaseSessionFromCookies(cookieString) {
    if (!cookieString) return null;

    try {
        // Supabase stores session as: sb-<project-ref>-auth-token
        // Find the cookie that matches this pattern
        const cookies = cookieString.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        // Look for Supabase auth token cookie
        const authTokenKey = Object.keys(cookies).find(
            (key) => key.startsWith('sb-') && key.endsWith('-auth-token'),
        );

        if (!authTokenKey) return null;

        // Parse the session JSON
        const sessionData = JSON.parse(
            decodeURIComponent(cookies[authTokenKey]),
        );
        return sessionData;
    } catch (error) {
        console.error('Error parsing Supabase session from cookies:', error);
        return null;
    }
}

/**
 * Extract access token from Supabase session
 * @param {string} cookieString - Raw cookie string from req.headers.cookie
 * @returns {string|null} - JWT access token or null
 */
export function getAccessTokenFromCookies(cookieString) {
    const session = getSupabaseSessionFromCookies(cookieString);
    return session?.access_token || null;
}

/**
 * Create headers object with Authorization for SSR API calls
 * @param {string} cookieString - Raw cookie string from req.headers.cookie
 * @returns {Object} - Headers object with Authorization if token exists
 */
export function createAuthHeaders(cookieString) {
    const accessToken = getAccessTokenFromCookies(cookieString);

    if (!accessToken) {
        console.warn('⚠️ No access token found in cookies for SSR request');
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}
