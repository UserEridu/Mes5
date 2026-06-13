import express from 'express';
import 'dotenv/config';

import categoriasRouter from './routes/categorias.js';
import estatusRouter from './routes/estatus.js';
import productosRouter from './routes/productos.js';
import marcasRouter from './routes/marcas.js';
import subcategoriasRouter from './routes/subcategorias.js';
import usuariosRouter from './routes/usuarios.js';
import carritosRouter from './routes/carritos.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/categorias', categoriasRouter);
app.use('/api/estatus', estatusRouter);
app.use('/api/productos', productosRouter);
app.use('/api/marcas', marcasRouter);
app.use('/api/subcategorias', subcategoriasRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/carritos', carritosRouter);

app.get('/', (req, res) => {
    res.json({ mensaje: 'API Damasco funcionando 🚀' });
});

app.use((err, req, res, next) => {
    console.error('Error no capturado:', err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});