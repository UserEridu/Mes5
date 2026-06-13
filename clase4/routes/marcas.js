import { Router } from 'express';
import * as marcasController from '../controllers/marcasController.js';

const router = Router();

router.get('/', marcasController.getAllMarcas);
router.get('/:id', marcasController.getMarcaById);
router.post('/', marcasController.createMarca);
router.put('/:id', marcasController.updateMarca);
router.delete('/:id', marcasController.deleteMarca);

export default router;