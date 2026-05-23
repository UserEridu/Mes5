import express from 'express';
import usuariosRouter from './routes/usuarios.js';
import categoriasRouter from './routes/categorias.js';
import productosRouter from './routes/productos.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  if (!req.body) req.body = {};
  next();
});

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST con datos desde JSON',
    endpoints: {
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos'
    }
  });
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log('Servidor en http://localhost:' + PORT);
});