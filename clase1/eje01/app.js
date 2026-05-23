import express from 'express';
const productos = [];
const categorias = [
    {
        "id": 1,
        "nombre": "Electrodomesticos"
    },
    {
        "id": 2,
        "nombre": "Alimentos"
    }
];
const generos = [{
    id: 1,
    "nombre": "Bachata"
},
{
    id: 2,
    "nombre": "Salsa"
},
{
    id: 3,
    "nombre": "Merengue"
},
{
    id: 4,
    "nombre": "Pop"
}
];
const app = express();

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola desde Express, soy UserEridu' });
});

app.get('/productos', (req, res) => {
  res.json(productos);
});

app.get('/generos', (req, res) => {
  res.json(generos);
});

app.get('/categorias', (req, res) => {
  res.json(categorias);
});

app.post('/productos', (req, res) => {
  productos.push({ id: Date.now(), nombre: 'Producto nuevo ' + (productos.length + 1) });
  res.status(201).json({ mensaje: 'Producto creado. Total: ' + productos.length });
});

app.delete('/productos', (req, res) => {
  productos.length = 0;
  res.json({ mensaje: 'Todos eliminados' });
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});