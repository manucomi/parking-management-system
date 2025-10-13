import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import residentRoutes from './routes/residentRoutes.js';
import spotRoutes from './routes/spotRoutes.js';
import raffleRoutes from './routes/raffleRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    }),
);
app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

app.use('/api/residents', residentRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/raffle', raffleRoutes);
app.use('/api/history', historyRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
