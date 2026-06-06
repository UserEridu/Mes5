import { Router } from 'express';
import * as generosController from '../controllers/generosController.js';

const router = Router();

router.get('/', generosController.getAllGeneros);
//router.get('/:id', generosController.getGeneroById);
//router.post('/', generosController.createGenero);
//router.put('/:id', generosController.updateGenero);
//router.delete('/:id', generosController.deleteGenero);

export default router;