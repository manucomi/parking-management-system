/**
 * Next.js Middleware
 *
 * Refreshes Supabase auth tokens automatically
 * Runs on every request to protected routes
 */

import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon)
         * - public files (images, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
