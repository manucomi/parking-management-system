/**
 * Supabase Client Configuration (Frontend - Browser)
 *
 * Uses @supabase/ssr for proper cookie handling in Next.js
 * This client is for Client Components only
 */

import { createBrowserClient } from '@supabase/ssr';

// Environment variables (set in Vercel dashboard for production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
    console.warn(
        '⚠️ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable',
    );
}

/**
 * Supabase client instance for browser (Client Components)
 *
 * This client automatically handles cookies for SSR compatibility
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
