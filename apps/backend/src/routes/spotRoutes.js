import express from 'express';
import * as spotController from '../controllers/spotController.js';

const router = express.Router();

router.get('/', spotController.getAllSpots);
router.get('/:id', spotController.getSpotById);
router.post('/', spotController.createSpot);
router.patch('/:id', spotController.updateSpot);
router.delete('/:id', spotController.deleteSpot);

export default router;
