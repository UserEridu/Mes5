import pool from '../config/db.js';

export const getAllCarritos = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, u.nombre as usuario_nombre, u.email as usuario_email,
                   COALESCE(SUM(ic.cantidad), 0) as total_productos,
                   COALESCE(SUM(ic.cantidad * p.precio), 0) as total_dolares
            FROM carritos c
            JOIN usuarios u ON c.usuario_id = u.id
            LEFT JOIN items_carrito ic ON c.id = ic.carrito_id
            LEFT JOIN productos p ON ic.producto_id = p.id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getCarritoByUsuario = async (req, res, next) => {
    try {
        const { usuario_id } = req.params;
        const [carritos] = await pool.query('SELECT * FROM carritos WHERE usuario_id = ?', [usuario_id]);
        if (carritos.length === 0) {
            return res.json({ carrito_id: null, items: [] });
        }
        
        const carrito_id = carritos[0].id;
        const [items] = await pool.query(`
            SELECT ic.id as item_id, ic.cantidad, ic.added_at,
                   p.id as producto_id, p.nombre, p.precio, p.imagen
            FROM items_carrito ic
            JOIN productos p ON ic.producto_id = p.id
            WHERE ic.carrito_id = ?
            ORDER BY ic.added_at DESC
        `, [carrito_id]);
        
        let total_productos = 0;
        let total_dolares = 0;
        items.forEach(item => {
            total_productos += item.cantidad;
            total_dolares += (item.cantidad * item.precio);
        });
        
        res.json({ carrito_id, total_productos, total_dolares, items });
    } catch (error) {
        next(error);
    }
};

export const addItemToCarrito = async (req, res, next) => {
    try {
        const { usuario_id } = req.params;
        const { producto_id, cantidad } = req.body;
        
        if (!producto_id || !cantidad) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: producto_id, cantidad' });
        }
        
        // Ensure cart exists
        let [carritos] = await pool.query('SELECT id FROM carritos WHERE usuario_id = ?', [usuario_id]);
        let carrito_id;
        if (carritos.length === 0) {
            const [result] = await pool.query('INSERT INTO carritos (usuario_id) VALUES (?)', [usuario_id]);
            carrito_id = result.insertId;
        } else {
            carrito_id = carritos[0].id;
        }
        
        // Check if item already exists
        const [items] = await pool.query('SELECT id, cantidad FROM items_carrito WHERE carrito_id = ? AND producto_id = ?', [carrito_id, producto_id]);
        if (items.length > 0) {
            const newQuantity = items[0].cantidad + parseInt(cantidad);
            await pool.query('UPDATE items_carrito SET cantidad = ? WHERE id = ?', [newQuantity, items[0].id]);
            return res.json({ mensaje: 'Cantidad actualizada', item_id: items[0].id, cantidad: newQuantity });
        } else {
            const [result] = await pool.query(
                'INSERT INTO items_carrito (carrito_id, usuario_id, producto_id, cantidad) VALUES (?, ?, ?, ?)',
                [carrito_id, usuario_id, producto_id, cantidad]
            );
            return res.status(201).json({ mensaje: 'Producto agregado', item_id: result.insertId, producto_id, cantidad });
        }
    } catch (error) {
        next(error);
    }
};

export const updateItemQuantity = async (req, res, next) => {
    try {
        const { usuario_id, item_id } = req.params;
        const { cantidad } = req.body;
        
        if (!cantidad || cantidad < 1) {
            return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
        }
        
        const [carritos] = await pool.query('SELECT id FROM carritos WHERE usuario_id = ?', [usuario_id]);
        if (carritos.length === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
        
        const [result] = await pool.query('UPDATE items_carrito SET cantidad = ? WHERE id = ? AND carrito_id = ?', [cantidad, item_id, carritos[0].id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Item no encontrado en el carrito' });
        res.json({ mensaje: 'Cantidad actualizada', cantidad });
    } catch (error) {
        next(error);
    }
};

export const removeItemFromCarrito = async (req, res, next) => {
    try {
        const { usuario_id, item_id } = req.params;
        
        const [carritos] = await pool.query('SELECT id FROM carritos WHERE usuario_id = ?', [usuario_id]);
        if (carritos.length === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
        
        const [result] = await pool.query('DELETE FROM items_carrito WHERE id = ? AND carrito_id = ?', [item_id, carritos[0].id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Item no encontrado en el carrito' });
        res.json({ mensaje: 'Producto eliminado del carrito' });
    } catch (error) {
        next(error);
    }
};

export const clearCarrito = async (req, res, next) => {
    try {
        const { usuario_id } = req.params;
        
        const [carritos] = await pool.query('SELECT id FROM carritos WHERE usuario_id = ?', [usuario_id]);
        if (carritos.length === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
        
        await pool.query('DELETE FROM items_carrito WHERE carrito_id = ?', [carritos[0].id]);
        res.json({ mensaje: 'Carrito vaciado' });
    } catch (error) {
        next(error);
    }
};