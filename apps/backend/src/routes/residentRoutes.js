import express from 'express';
import * as residentController from '../controllers/residentController.js';

const router = express.Router();

router.get('/', residentController.getAllResidents);
router.get('/:id', residentController.getResidentById);
router.post('/', residentController.createResident);
router.put('/:id', residentController.updateResident);
router.delete('/:id', residentController.deleteResident);

export default router;
