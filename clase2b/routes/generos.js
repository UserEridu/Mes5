import { Router } from 'express';
import * as generosController from '../controllers/generosController.js';

const router = Router();

router.get('/', generosController.getAllGeneros);//muestra todos los generos
router.get('/:id', generosController.getGeneroById);//muestra un genero por id
router.post('/', generosController.createGenero);//agrega
router.put('/:id', generosController.updateGenero);//modifica
router.delete('/:id', generosController.deleteGenero);//elimina

export default router;