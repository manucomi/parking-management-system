/**
 * Authentication Routes
 *
 * Handles user signup, login, and token management via Supabase Auth.
 */

import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 *
 * Register a new user with email/password.
 * Supabase sends a confirmation email by default (can be disabled in dashboard).
 *
 * Body: { email: string, password: string }
 */
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
        }

        // Create user via Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        // Return user data (session contains access_token if email confirmation disabled)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: data.user?.id,
                email: data.user?.email,
            },
            session: data.session
                ? {
                      access_token: data.session.access_token,
                      refresh_token: data.session.refresh_token,
                  }
                : null,
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during signup',
        });
    }
});

/**
 * POST /api/auth/login
 *
 * Authenticate user and return JWT access token.
 *
 * Body: { email: string, password: string }
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
        }

        // Authenticate via Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // Return session tokens
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
            },
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
            },
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during login',
        });
    }
});

/**
 * POST /api/auth/logout
 *
 * Invalidate current session (requires valid token in header).
 *
 * Headers: Authorization: Bearer <token>
 */
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'No token provided',
            });
        }

        // Sign out via Supabase (invalidates token)
        const { error } = await supabase.auth.admin.signOut(token);

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        res.json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during logout',
        });
    }
});

/**
 * POST /api/auth/refresh
 *
 * Refresh access token using refresh token.
 *
 * Body: { refresh_token: string }
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required',
            });
        }

        // Refresh session via Supabase
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token,
        });

        if (error) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired refresh token',
            });
        }

        res.json({
            success: true,
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
            },
        });
    } catch (error) {
        console.error('❌ Token refresh error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during token refresh',
        });
    }
});

export default router;
