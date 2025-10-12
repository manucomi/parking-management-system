/**
 * API Route: GET /api/raffles
 * Get all raffles with optional filters and pagination
 */

import { getAllRaffles as getRafflesFromDB } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { page = 1, limit = 10, status, dateFrom, dateTo } = req.query;

        const params = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            status,
            dateFrom,
            dateTo,
        };

        // TODO: Replace with actual database call when backend is integrated
        const result = await getRafflesFromDB(params);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching raffles:', error);
        return res.status(500).json({
            error: 'Failed to fetch raffles',
            message: error.message,
        });
    }
}
