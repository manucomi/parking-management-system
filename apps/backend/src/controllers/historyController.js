import * as historyService from '../services/historyService.js';

export const getResidentHistory = async (req, res, next) => {
    try {
        const history = await historyService.findByResident(
            req.params.residentId,
        );
        res.json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};
