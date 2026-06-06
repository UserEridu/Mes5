import { Router } from 'express';
import * as juegosController from '../controllers/juegosController.js';

const router = Router();

router.get('/', juegosController.getAllJuegos);
router.get('/:id', juegosController.getJuegoById);
router.post('/', juegosController.createJuego);
router.put('/:id', juegosController.updateJuego);
router.delete('/:id', juegosController.deleteJuego);

export default router;