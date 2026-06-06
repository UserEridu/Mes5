import express from 'express';
import 'dotenv/config';

import juegosRouter from './routes/juegos.js';
import generosRouter from './routes/generos.js';
import plataformasRouter from './routes/plataformas.js';
import usuariosRouter from './routes/usuarios.js'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: permite recibir JSON en el body
app.use(express.json());

// Rutas

app.use('/api/juegos', juegosRouter);
app.use('/api/generos', generosRouter);
app.use('/api/plataformas', plataformasRouter);
app.use('/api/usuario', usuariosRouter);

// Ruta de prueba: verificar que el servidor funciona
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de videojuegos funcionando 🚀' });
});

// Middleware Global de Manejo de Errores
app.use((err, req, res, next) => {
    console.error('Error no capturado:', err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});