import { Router } from 'express';

const router = Router();

import usuarios from '../data/usuarios.json' with { type: 'json' };
let nextId = 4;

router.get('/', (req, res) => {
  res.json(usuarios);
});

router.get('/:id', (req, res) => {
  const user = usuarios.find(u => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(user);
});

router.post('/', (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'nombre y email son requeridos' });
  }

  const nuevo = {
    id: nextId++,
    nombre,
    email
  };

  usuarios.push(nuevo);
  res.status(201).json(nuevo);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nombre, email } = req.body;

  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (!nombre || !email) {
    return res.status(400).json({ error: 'nombre y email son requeridos' });
  }

  usuarios[index] = {
    id,
    nombre,
    email
  };

  res.json(usuarios[index]);
});

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = usuarios.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const { nombre, email } = req.body;

  if (nombre !== undefined) {
    user.nombre = nombre;
  }

  if (email !== undefined) {
    user.email = email;
  }

  res.json(user);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const eliminado = usuarios.splice(index, 1);

  res.json({
    mensaje: 'Usuario eliminado',
    usuario: eliminado[0]
  });
});

export default router;