import { Router } from 'express';
import * as subcategoriasController from '../controllers/subcategoriasController.js';

const router = Router();

router.get('/', subcategoriasController.getAllSubcategorias);
router.get('/:id', subcategoriasController.getSubcategoriaById);
router.post('/', subcategoriasController.createSubcategoria);
router.put('/:id', subcategoriasController.updateSubcategoria);
router.delete('/:id', subcategoriasController.deleteSubcategoria);

export default router;