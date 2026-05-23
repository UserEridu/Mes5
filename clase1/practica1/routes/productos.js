import { Router } from 'express';
const router = Router();

const productos = [
  { id: 1, nombre: 'Laptop', precio: 15000, categoriaId: 1, usuarioId: 1 },
  { id: 2, nombre: 'Camiseta', precio: 350, categoriaId: 2, usuarioId: 2 }
];
let nextId = 3;

router.get('/', (req, res) => {
  res.json(productos);
});

router.get('/:id', (req, res) => {
  const prod = productos.find(p => p.id === Number(req.params.id));
  if (!prod) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(prod);
});

router.post('/', (req, res) => {
  const { nombre, precio, categoriaId, usuarioId } = req.body;
  // isNaN evita que se guarde "abc" como NaN silenciosamente
  if (!nombre || precio === undefined || isNaN(Number(precio))) {
    return res.status(400).json({ error: 'nombre (texto) y precio (número válido) son requeridos' });
  }
  const nuevo = {
    id: nextId++,
    nombre,
    precio: Number(precio),
    categoriaId: categoriaId !== undefined ? Number(categoriaId) : null,
    usuarioId: usuarioId !== undefined ? Number(usuarioId) : null
  };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT: reemplaza TODOS los campos. Exige nombre + precio válido.
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  const { nombre, precio, categoriaId, usuarioId } = req.body;
  if (!nombre || precio === undefined || isNaN(Number(precio))) {
    return res.status(400).json({ error: 'nombre (texto) y precio (número válido) son requeridos' });
  }
  productos[index] = {
    id,
    nombre,
    precio: Number(precio),
    categoriaId: categoriaId !== undefined ? Number(categoriaId) : null,
    usuarioId: usuarioId !== undefined ? Number(usuarioId) : null
  };
  res.json(productos[index]);
});

// PATCH: actualiza SOLO los campos enviados (los no enviados se conservan)
router.patch('/:id', (req, res) => {
  const prod = productos.find(p => p.id === Number(req.params.id));
  if (!prod) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  const { nombre, precio, categoriaId, usuarioId } = req.body;
  if (nombre !== undefined) prod.nombre = nombre;
  if (precio !== undefined) prod.precio = Number(precio);
  if (categoriaId !== undefined) prod.categoriaId = Number(categoriaId);
  if (usuarioId !== undefined) prod.usuarioId = Number(usuarioId);
  res.json(prod);
});

router.delete('/:id', (req, res) => {
  const index = productos.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  const eliminado = productos.splice(index, 1);
  res.json({
    mensaje: 'Producto eliminado',
    producto: eliminado[0]
  });
});
export default router; 