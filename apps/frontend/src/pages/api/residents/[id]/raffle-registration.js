/**
 * API Route: /api/residents/[id]/raffle-registration
 * Handle raffle registration/unregistration for a resident
 */

import {
    registerResidentForRaffle,
    unregisterResidentFromRaffle,
} from '@/lib/db';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        switch (req.method) {
            case 'POST':
                return await handleRegister(id, req, res);
            case 'DELETE':
                return await handleUnregister(id, req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error(
            `Error handling raffle registration for resident ${id}:`,
            error,
        );
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
}

async function handleRegister(id, req, res) {
    const registrationData = req.body || {};

    try {
        const result = await registerResidentForRaffle(id, registrationData);

        if (!result) {
            return res
                .status(404)
                .json({ error: 'Resident not found or already registered' });
        }

        return res.status(200).json(result);
    } catch (error) {
        if (error.message.includes('not eligible')) {
            return res.status(400).json({ error: error.message });
        }
        throw error;
    }
}

async function handleUnregister(id, req, res) {
    const result = await unregisterResidentFromRaffle(id);

    if (!result) {
        return res
            .status(404)
            .json({ error: 'Resident not found or not registered' });
    }

    return res.status(200).json({
        success: true,
        message: 'Successfully unregistered from raffle',
    });
}
