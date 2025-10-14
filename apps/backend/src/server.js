import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import residentRoutes from './routes/residentRoutes.js';
import spotRoutes from './routes/spotRoutes.js';
import raffleRoutes from './routes/raffleRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { verifyToken } from './middleware/authMiddleware.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS to accept multiple origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }),
);
app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Debug endpoint to test database connection
app.get('/api/debug/db', async (req, res) => {
    try {
        const hasDbUrl = !!process.env.DATABASE_URL;
        const dbUrlPrefix = process.env.DATABASE_URL
            ? process.env.DATABASE_URL.substring(0, 20) + '...'
            : 'NOT SET';

        const result = await pool.query('SELECT NOW()');
        res.json({
            success: true,
            message: 'Database connected',
            timestamp: result.rows[0],
            config: {
                hasDbUrl,
                dbUrlPrefix,
                nodeEnv: process.env.NODE_ENV,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            code: error.code,
            hasDbUrl: !!process.env.DATABASE_URL,
            dbUrlPrefix: process.env.DATABASE_URL
                ? process.env.DATABASE_URL.substring(0, 20) + '...'
                : 'NOT SET',
            stack:
                process.env.NODE_ENV === 'development'
                    ? error.stack
                    : undefined,
        });
    }
});

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/residents', verifyToken, residentRoutes);
app.use('/api/spots', verifyToken, spotRoutes);
app.use('/api/raffle', verifyToken, raffleRoutes);
app.use('/api/history', verifyToken, historyRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
