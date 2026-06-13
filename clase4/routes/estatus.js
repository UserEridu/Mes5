import { Router } from 'express';
import * as estatusController from '../controllers/estatusController.js';

const router = Router();

router.get('/', estatusController.getAllEstatus);
router.get('/:id', estatusController.getEstatusById);
router.post('/', estatusController.createEstatus);
router.put('/:id', estatusController.updateEstatus);
router.delete('/:id', estatusController.deleteEstatus);

export default router;