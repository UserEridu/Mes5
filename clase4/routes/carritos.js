import { Router } from 'express';
import * as carritosController from '../controllers/carritosController.js';

const router = Router();

router.get('/', carritosController.getAllCarritos);
router.get('/usuario/:usuario_id', carritosController.getCarritoByUsuario);
router.post('/usuario/:usuario_id/items', carritosController.addItemToCarrito);
router.put('/usuario/:usuario_id/items/:item_id', carritosController.updateItemQuantity);
router.delete('/usuario/:usuario_id/items/:item_id', carritosController.removeItemFromCarrito);
router.delete('/usuario/:usuario_id', carritosController.clearCarrito);

export default router;