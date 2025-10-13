import * as spotService from '../services/spotService.js';

export const getAllSpots = async (req, res, next) => {
    try {
        const { status } = req.query;
        const spots = await spotService.findAll(status);
        res.json({ success: true, data: spots });
    } catch (error) {
        next(error);
    }
};

export const getSpotById = async (req, res, next) => {
    try {
        const spot = await spotService.findById(req.params.id);
        res.json({ success: true, data: spot });
    } catch (error) {
        next(error);
    }
};

export const createSpot = async (req, res, next) => {
    try {
        const spot = await spotService.create(req.body);
        res.status(201).json({
            success: true,
            data: spot,
            message: 'Spot created',
        });
    } catch (error) {
        next(error);
    }
};

export const updateSpot = async (req, res, next) => {
    try {
        const spot = await spotService.update(req.params.id, req.body);
        res.json({ success: true, data: spot, message: 'Spot updated' });
    } catch (error) {
        next(error);
    }
};

export const deleteSpot = async (req, res, next) => {
    try {
        await spotService.remove(req.params.id);
        res.json({ success: true, message: 'Spot deleted' });
    } catch (error) {
        next(error);
    }
};
