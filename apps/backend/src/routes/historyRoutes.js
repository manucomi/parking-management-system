import express from 'express';
import * as historyController from '../controllers/historyController.js';

const router = express.Router();

router.get('/:residentId', historyController.getResidentHistory);

export default router;
