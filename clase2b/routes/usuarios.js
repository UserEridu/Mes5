import { Router } from 'express';
import * as usuariosController from '../controllers/usuariosController.js';

const router = Router();

router.get('/', usuariosController.getAllUsuarios);//muestra todos los usuarios
router.get('/:id', usuariosController.getUsuarioById);//muestra un usuario por id
router.post('/', usuariosController.createUsuario);//agrega
router.put('/:id', usuariosController.updateUsuario);//modifica
router.delete('/:id', usuariosController.deleteUsuario);//elimina

export default router;