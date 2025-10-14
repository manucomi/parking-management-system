/**
 * JWT Authentication Middleware
 *
 * Verifies JWT tokens from Supabase Auth in the Authorization header.
 * Protects routes by ensuring requests contain valid, non-expired tokens.
 */

import { supabase } from '../config/supabaseClient.js';

/**
 * Middleware to verify JWT token
 *
 * Expected header format: Authorization: Bearer <token>
 * Attaches decoded user data to req.user on success.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const verifyToken = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Missing or invalid Authorization header',
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided',
            });
        }

        // Verify token with Supabase (validates signature and expiration)
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(403).json({
                success: false,
                error: 'Invalid or expired token',
            });
        }

        // Attach user to request for downstream use
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role || 'user',
        };

        next();
    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Authentication verification failed',
        });
    }
};

/**
 * Optional: Role-based authorization middleware
 *
 * Use after verifyToken to restrict routes by user role.
 *
 * @param {string[]} allowedRoles - Array of roles that can access the route
 * @returns {Function} Express middleware function
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
            });
        }

        next();
    };
};
