/**
 * API Route: GET /api/residents
 * Get all residents with optional filters and pagination
 */

import { getAllResidents as getResidentsFromDB } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            page = 1,
            limit = 10,
            search,
            building,
            hasParking,
        } = req.query;

        // Parse query parameters
        const params = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            search,
            building,
            hasParking:
                hasParking === 'true'
                    ? true
                    : hasParking === 'false'
                      ? false
                      : undefined,
        };

        // TODO: Replace with actual database call when backend is integrated
        const result = await getResidentsFromDB(params);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching residents:', error);
        return res.status(500).json({
            error: 'Failed to fetch residents',
            message: error.message,
        });
    }
}
