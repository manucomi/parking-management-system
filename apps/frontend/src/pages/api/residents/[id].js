/**
 * API Route: /api/residents/[id]
 * Handle single resident operations (GET, PUT, PATCH, DELETE)
 */

import {
    getResidentById as getResidentFromDB,
    updateResident as updateResidentInDB,
    deleteResident as deleteResidentFromDB,
} from '@/lib/db';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        switch (req.method) {
            case 'GET':
                return await handleGet(id, req, res);
            case 'PUT':
                return await handlePut(id, req, res);
            case 'PATCH':
                return await handlePatch(id, req, res);
            case 'DELETE':
                return await handleDelete(id, req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error(`Error handling resident ${id}:`, error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
}

async function handleGet(id, req, res) {
    const resident = await getResidentFromDB(id);

    if (!resident) {
        return res.status(404).json({ error: 'Resident not found' });
    }

    return res.status(200).json(resident);
}

async function handlePut(id, req, res) {
    const residentData = req.body;

    // Validate required fields for full update
    const requiredFields = [
        'name',
        'email',
        'phone',
        'building',
        'apartmentNumber',
    ];
    const missingFields = requiredFields.filter(
        (field) => !residentData[field],
    );

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            fields: missingFields,
        });
    }

    const updatedResident = await updateResidentInDB(id, residentData);

    if (!updatedResident) {
        return res.status(404).json({ error: 'Resident not found' });
    }

    return res.status(200).json(updatedResident);
}

async function handlePatch(id, req, res) {
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
    }

    const updatedResident = await updateResidentInDB(id, updates, {
        partial: true,
    });

    if (!updatedResident) {
        return res.status(404).json({ error: 'Resident not found' });
    }

    return res.status(200).json(updatedResident);
}

async function handleDelete(id, req, res) {
    const result = await deleteResidentFromDB(id);

    if (!result) {
        return res.status(404).json({ error: 'Resident not found' });
    }

    return res.status(200).json({
        success: true,
        message: 'Resident deleted successfully',
    });
}
