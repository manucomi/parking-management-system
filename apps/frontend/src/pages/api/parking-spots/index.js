/**
 * API Route: GET /api/parking-spots
 * Get all parking spots with optional filters and pagination
 */

import { getAllParkingSpots as getSpotsFromDB } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            page = 1,
            limit = 10,
            building,
            level,
            status,
            type,
        } = req.query;

        const params = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            building,
            level,
            status,
            type,
        };

        // TODO: Replace with actual database call when backend is integrated
        const result = await getSpotsFromDB(params);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching parking spots:', error);
        return res.status(500).json({
            error: 'Failed to fetch parking spots',
            message: error.message,
        });
    }
}
