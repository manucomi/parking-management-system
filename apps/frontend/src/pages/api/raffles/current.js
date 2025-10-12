/**
 * API Route: GET /api/raffles/current
 * Get the current active raffle
 */

import { getCurrentRaffle as getCurrentRaffleFromDB } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const currentRaffle = await getCurrentRaffleFromDB();

        if (!currentRaffle) {
            return res.status(200).json(null);
        }

        return res.status(200).json(currentRaffle);
    } catch (error) {
        console.error('Error fetching current raffle:', error);
        return res.status(500).json({
            error: 'Failed to fetch current raffle',
            message: error.message,
        });
    }
}
