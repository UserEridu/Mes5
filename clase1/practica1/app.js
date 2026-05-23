import express from 'express';

import usuariosRouter from './routes/usuarios.js';
import categoriasRouter from './routes/categorias.js';
import productosRouter from './routes/productos.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware: si falta Content-Type, req.body no explota
app.use((req, res, next) => {
  if (!req.body) req.body = {};
  next();
});

// Ruta raíz con documentación de la API
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST',
    endpoints: {
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos'
    },
    metodos: {
      GET: 'Listar todos o uno por id',
      POST: 'Crear un nuevo recurso',
      PUT: 'Reemplazar TODO (requiere todos los campos)',
      PATCH: 'Actualizar parcialmente (solo los campos a modificar)',
      DELETE: 'Eliminar por id'
    }
  });
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log('Servidor en http://localhost:' + PORT);
});   