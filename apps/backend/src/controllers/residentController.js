import * as residentService from '../services/residentService.js';

export const getAllResidents = async (req, res, next) => {
    try {
        const residents = await residentService.findAll();
        res.json({ success: true, data: residents });
    } catch (error) {
        next(error);
    }
};

export const getResidentById = async (req, res, next) => {
    try {
        const resident = await residentService.findById(req.params.id);
        res.json({ success: true, data: resident });
    } catch (error) {
        next(error);
    }
};

export const createResident = async (req, res, next) => {
    try {
        const resident = await residentService.create(req.body);
        res.status(201).json({
            success: true,
            data: resident,
            message: 'Resident created',
        });
    } catch (error) {
        next(error);
    }
};

export const updateResident = async (req, res, next) => {
    try {
        const resident = await residentService.update(req.params.id, req.body);
        res.json({
            success: true,
            data: resident,
            message: 'Resident updated',
        });
    } catch (error) {
        next(error);
    }
};

export const deleteResident = async (req, res, next) => {
    try {
        await residentService.remove(req.params.id);
        res.json({ success: true, message: 'Resident deleted' });
    } catch (error) {
        next(error);
    }
};
