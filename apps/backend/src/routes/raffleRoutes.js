import express from 'express';
import * as raffleController from '../controllers/raffleController.js';

const router = express.Router();

router.post('/join', raffleController.joinRaffle);
router.post('/run', raffleController.runRaffle);
router.get('/results', raffleController.getRaffleResults);
router.get('/current', raffleController.getCurrentRaffle);

export default router;
