import express from 'express';
import * as raffleController from '../controllers/raffleController.js';

const router = express.Router();

router.post('/join', raffleController.joinRaffle);
router.post('/run', raffleController.runRaffle);
router.get('/results', raffleController.getRaffleResults);
router.get('/current', raffleController.getCurrentRaffle);
router.get('/all', raffleController.getAllRaffles);
router.get('/:raffleId/participants', raffleController.getRaffleParticipants);

export default router;
