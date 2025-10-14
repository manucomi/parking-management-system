/**
 * Supabase Server Client Configuration
 *
 * For use in:
 * - getServerSideProps (Pages Router)
 * - API Routes
 * - Server-side code
 *
 * Uses @supabase/ssr for proper cookie handling
 */

import { createServerClient } from '@supabase/ssr';

/**
 * Create Supabase client for server-side operations
 * @param {Object} context - Next.js context object with req/res
 * @returns {Object} Supabase client instance
 */
export function createClient(context) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return context.req.cookies[name];
                },
                set(name, value, options) {
                    context.res.setHeader(
                        'Set-Cookie',
                        `${name}=${value}; Path=/; ${options.maxAge ? `Max-Age=${options.maxAge};` : ''} HttpOnly; SameSite=Lax`,
                    );
                },
                remove(name, options) {
                    context.res.setHeader(
                        'Set-Cookie',
                        `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
                    );
                },
            },
        },
    );
}
