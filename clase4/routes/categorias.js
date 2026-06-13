import { Router } from 'express';
import * as categoriasController from '../controllers/categoriasController.js';

const router = Router();

router.get('/', categoriasController.getAllCategorias);
router.get('/:id', categoriasController.getCategoriaById);
router.post('/', categoriasController.createCategoria);
router.put('/:id', categoriasController.updateCategoria);
router.delete('/:id', categoriasController.deleteCategoria);

export default router;