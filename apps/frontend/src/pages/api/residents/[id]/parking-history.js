/**
 * API Route: /api/residents/[id]/parking-history
 * Get parking allocation history for a resident
 */

import { getResidentParkingHistory as getHistoryFromDB } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
        const history = await getHistoryFromDB(id);

        if (!history) {
            return res.status(404).json({ error: 'Resident not found' });
        }

        return res.status(200).json(history);
    } catch (error) {
        console.error(
            `Error fetching parking history for resident ${id}:`,
            error,
        );
        return res.status(500).json({
            error: 'Failed to fetch parking history',
            message: error.message,
        });
    }
}
