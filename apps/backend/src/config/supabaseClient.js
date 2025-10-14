/**
 * Supabase Client Configuration
 *
 * Initializes Supabase client for backend authentication and user management.
 * Uses service role key for admin-level operations (e.g., user verification).
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
    console.error('❌ Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

/**
 * Supabase client with service role key
 * WARNING: Service role bypasses Row Level Security (RLS). Use with caution.
 */
export const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    },
);

console.log('✅ Supabase client initialized');
