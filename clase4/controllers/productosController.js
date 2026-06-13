import pool from '../config/db.js';

export const getAllProductos = async (req, res, next) => {
    try {
        const { idcategoria, idsubcategoria, idmarca, min_precio, max_precio } = req.query;
        let sql = `
        SELECT p.*, c.nombre AS categoria,
               s.nombre AS subcategoria, m.nombre AS marca,
               e.nombre AS estatus
        FROM productos p
        JOIN categorias c ON p.idcategoria = c.id
        LEFT JOIN subcategorias s ON p.idsubcategoria = s.id
        LEFT JOIN marcas m ON p.idmarca = m.id
        JOIN estatus e ON p.idestatus = e.id
        WHERE 1=1`;
        const params = [];
        if (idcategoria) { sql += ' AND p.idcategoria = ?'; params.push(idcategoria); }
        if (idsubcategoria) { sql += ' AND p.idsubcategoria = ?'; params.push(idsubcategoria); }
        if (idmarca) { sql += ' AND p.idmarca = ?'; params.push(idmarca); }
        if (min_precio) { sql += ' AND p.precio >= ?'; params.push(min_precio); }
        if (max_precio) { sql += ' AND p.precio <= ?'; params.push(max_precio); }
        sql += ' ORDER BY p.nombre ASC';

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getProductoById = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.*, c.nombre AS categoria,
                    s.nombre AS subcategoria, m.nombre AS marca,
                    e.nombre AS estatus
             FROM productos p
             JOIN categorias c ON p.idcategoria = c.id
             LEFT JOIN subcategorias s ON p.idsubcategoria = s.id
             LEFT JOIN marcas m ON p.idmarca = m.id
             JOIN estatus e ON p.idestatus = e.id
             WHERE p.id = ?`,
            [req.params.id]
        );
        if (!rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createProducto = async (req, res, next) => {
    try {
        const { nombre, idcategoria, idsubcategoria, idmarca, idestatus, tipo, estrellas, precio, preciofull, stock, imagen } = req.body;
        if (!nombre || !idcategoria || precio == null) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, idcategoria, precio' });
        }
        const [existente] = await pool.query('SELECT id FROM productos WHERE nombre = ?', [nombre]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe un producto con ese nombre' });
        }
        const [result] = await pool.query(
            `INSERT INTO productos (nombre, idcategoria, idsubcategoria, idmarca, idestatus, tipo, estrellas, precio, preciofull, stock, imagen)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, idcategoria, idsubcategoria || null, idmarca || null, idestatus || 1, tipo || null, estrellas || 0, precio, preciofull || precio, stock || 0, imagen || null]
        );
        res.status(201).json({ id: result.insertId, nombre, idcategoria, precio });
    } catch (error) {
        next(error);
    }
};

export const updateProducto = async (req, res, next) => {
    try {
        const { nombre, idcategoria, idsubcategoria, idmarca, idestatus, tipo, estrellas, precio, preciofull, stock, imagen } = req.body;
        const [existente] = await pool.query('SELECT id FROM productos WHERE nombre = ? AND id != ?', [nombre, req.params.id]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe otro producto con ese nombre' });
        }
        const [result] = await pool.query(
            `UPDATE productos SET nombre=?, idcategoria=?, idsubcategoria=?, idmarca=?, idestatus=?, tipo=?, estrellas=?, precio=?, preciofull=?, stock=?, imagen=?
             WHERE id=?`,
            [nombre, idcategoria, idsubcategoria, idmarca, idestatus, tipo, estrellas, precio, preciofull, stock, imagen, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto actualizado' });
    } catch (error) {
        next(error);
    }
};

export const deleteProducto = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        next(error);
    }
};