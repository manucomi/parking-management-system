/**
 * useAuth Hook
 *
 * Provides authentication state and methods for login, signup, and logout.
 * Manages Supabase session and syncs with backend API.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    /**
     * Initialize auth state from Supabase session
     */
    useEffect(() => {
        // Get initial session
        supabase.auth
            .getSession()
            .then(({ data: { session: currentSession } }) => {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                setLoading(false);
            });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * Sign up new user
     *
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {Object} options - Additional signup options (e.g., metadata)
     * @returns {Promise<{data, error}>} Supabase signup response
     */
    const signup = useCallback(async (email, password, options = {}) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options,
            });

            // Don't throw, just return the error
            if (error) {
                console.warn('⚠️ Signup failed:', error.message);
                return { data: null, error };
            }

            return { data, error: null };
        } catch (error) {
            console.error('❌ Signup error:', error);
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Sign in existing user
     *
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<{data, error}>} Supabase login response
     */
    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            // Don't throw, just return the error
            if (error) {
                console.warn('⚠️ Login failed:', error.message);
                return { data: null, error };
            }

            return { data, error: null };
        } catch (error) {
            console.error('❌ Login error:', error);
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Sign out current user
     *
     * @returns {Promise<{error}>} Supabase logout response
     */
    const logout = useCallback(async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();

            // Don't throw, just return the error
            if (error) {
                console.warn('⚠️ Logout failed:', error.message);
                return { error };
            }

            setUser(null);
            setSession(null);

            return { error: null };
        } catch (error) {
            console.error('❌ Logout error:', error);
            return { error };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get current access token for API requests
     *
     * @returns {Promise<string|null>} JWT access token
     */
    const getAccessToken = useCallback(async () => {
        if (!session) return null;

        const {
            data: { session: currentSession },
        } = await supabase.auth.getSession();

        return currentSession?.access_token ?? null;
    }, [session]);

    return {
        user,
        session,
        loading,
        signup,
        login,
        logout,
        getAccessToken,
    };
}
