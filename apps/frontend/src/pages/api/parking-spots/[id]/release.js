/**
 * API Route: /api/parking-spots/[id]/release
 * Release/unassign a parking spot
 */

import { releaseParkingSpot } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { reason, effectiveDate } = req.body || {};

    try {
        // TODO: Add authorization check
        // if (!isAdmin(req)) {
        //     return res.status(403).json({ error: 'Forbidden' });
        // }

        const result = await releaseParkingSpot(id, {
            reason,
            effectiveDate: effectiveDate || new Date().toISOString(),
        });

        if (!result) {
            return res
                .status(404)
                .json({ error: 'Parking spot not found or not assigned' });
        }

        return res.status(200).json({
            success: true,
            message: 'Parking spot released successfully',
        });
    } catch (error) {
        console.error(`Error releasing parking spot ${id}:`, error);
        return res.status(500).json({
            error: 'Failed to release parking spot',
            message: error.message,
        });
    }
}
