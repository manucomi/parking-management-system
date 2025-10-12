/**
 * API Route: /api/parking-spots/[id]/assign
 * Assign a parking spot to a resident
 */

import { assignParkingSpot } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { residentId, startDate, endDate, notes } = req.body || {};

    try {
        // Validate required fields
        if (!residentId || !startDate || !endDate) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['residentId', 'startDate', 'endDate'],
            });
        }

        // TODO: Add authorization check
        // if (!isAdmin(req)) {
        //     return res.status(403).json({ error: 'Forbidden' });
        // }

        const result = await assignParkingSpot(id, {
            residentId,
            startDate,
            endDate,
            notes,
        });

        if (!result) {
            return res
                .status(404)
                .json({ error: 'Parking spot not found or already assigned' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error assigning parking spot ${id}:`, error);

        if (error.message.includes('already assigned')) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({
            error: 'Failed to assign parking spot',
            message: error.message,
        });
    }
}
