/**
 * API Route: /api/raffles/[id]/execute
 * Execute/run a raffle and generate winners
 */

import { executeRaffle } from '@/lib/raffle';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { sendNotifications = true, algorithm = 'random' } = req.body || {};

    try {
        // TODO: Add authorization check - only admins should be able to run raffles
        // if (!isAdmin(req)) {
        //     return res.status(403).json({ error: 'Forbidden' });
        // }

        const result = await executeRaffle(id, {
            sendNotifications,
            algorithm,
        });

        if (!result) {
            return res
                .status(404)
                .json({ error: 'Raffle not found or already executed' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error executing raffle ${id}:`, error);

        if (error.message.includes('already executed')) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({
            error: 'Failed to execute raffle',
            message: error.message,
        });
    }
}
