import * as raffleService from '../services/raffleService.js';

export const joinRaffle = async (req, res, next) => {
    try {
        const { residentId } = req.body;
        const registration = await raffleService.registerResident(residentId);
        res.json({
            success: true,
            data: registration,
            message: 'Joined raffle successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const runRaffle = async (req, res, next) => {
    try {
        const results = await raffleService.executeRaffle();
        res.json({
            success: true,
            data: results,
            message: 'Raffle executed successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getRaffleResults = async (req, res, next) => {
    try {
        const results = await raffleService.getLatestResults();
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

export const getCurrentRaffle = async (req, res, next) => {
    try {
        const raffle = await raffleService.getCurrent();
        res.json({ success: true, data: raffle });
    } catch (error) {
        next(error);
    }
};
