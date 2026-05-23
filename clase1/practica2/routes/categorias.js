import { Router } from 'express';
const router = Router();

import categorias from '../data/categorias.json' with { type: 'json' };
let nextId = 5;

router.get('/', (req, res) => {
  res.json(categorias);
});

router.get('/:id', (req, res) => {
  const cat = categorias.find(c => c.id === Number(req.params.id));

  if (!cat) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  res.json(cat);
});

router.post('/', (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'nombre es requerido' });
  }

  const nueva = {
    id: nextId++,
    nombre
  };

  categorias.push(nueva);
  res.status(201).json(nueva);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = categorias.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'nombre es requerido' });
  }

  categorias[index] = {
    id,
    nombre
  };

  res.json(categorias[index]);
});

router.patch('/:id', (req, res) => {
  const cat = categorias.find(c => c.id === Number(req.params.id));

  if (!cat) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  const { nombre } = req.body;

  if (nombre !== undefined) {
    cat.nombre = nombre;
  }

  res.json(cat);
});

router.delete('/:id', (req, res) => {
  const index = categorias.findIndex(c => c.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  const eliminada = categorias.splice(index, 1);

  res.json({
    mensaje: 'Categoría eliminada',
    categoria: eliminada[0]
  });
});

export default router;