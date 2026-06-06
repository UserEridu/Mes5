import { Router } from 'express';
import * as plataformasController from '../controllers/plataformasController.js';

const router = Router();

router.get('/', plataformasController.getAllPlataformas);
router.get('/:id', plataformasController.getPlataformaById);
router.post('/', plataformasController.createPlataforma);
router.put('/:id', plataformasController.updatePlataforma);
router.delete('/:id', plataformasController.deletePlataforma);

export default router;