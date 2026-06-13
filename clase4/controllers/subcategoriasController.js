import pool from '../config/db.js';

export const getAllSubcategorias = async (req, res, next) => {
    try {
        const { idcategoria } = req.query;
        let sql = `
        SELECT s.*, c.nombre AS categoria, e.nombre AS estatus
        FROM subcategorias s
        JOIN categorias c ON s.idcategoria = c.id
        JOIN estatus e ON s.idestatus = e.id
        WHERE 1=1`;
        const params = [];
        if (idcategoria) { sql += ' AND s.idcategoria = ?'; params.push(idcategoria); }
        sql += ' ORDER BY s.nombre ASC';

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getSubcategoriaById = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT s.*, c.nombre AS categoria, e.nombre AS estatus
             FROM subcategorias s
             JOIN categorias c ON s.idcategoria = c.id
             JOIN estatus e ON s.idestatus = e.id
             WHERE s.id = ?`,
            [req.params.id]
        );
        if (!rows[0]) return res.status(404).json({ error: 'Subcategoría no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createSubcategoria = async (req, res, next) => {
    try {
        const { nombre, idcategoria, idestatus } = req.body;
        if (!nombre || !idcategoria) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, idcategoria' });
        }
        const [existente] = await pool.query(
            'SELECT id FROM subcategorias WHERE nombre = ? AND idcategoria = ?',
            [nombre, idcategoria]
        );
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe una subcategoría con ese nombre en esta categoría' });
        }
        const [result] = await pool.query(
            'INSERT INTO subcategorias (nombre, idcategoria, idestatus) VALUES (?, ?, ?)',
            [nombre, idcategoria, idestatus || 1]
        );
        res.status(201).json({ id: result.insertId, nombre, idcategoria, idestatus: idestatus || 1 });
    } catch (error) {
        next(error);
    }
};

export const updateSubcategoria = async (req, res, next) => {
    try {
        const { nombre, idcategoria, idestatus } = req.body;
        const [existente] = await pool.query(
            'SELECT id FROM subcategorias WHERE nombre = ? AND idcategoria = ? AND id != ?',
            [nombre, idcategoria, req.params.id]
        );
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe otra subcategoría con ese nombre en esta categoría' });
        }
        const [result] = await pool.query(
            'UPDATE subcategorias SET nombre = ?, idcategoria = ?, idestatus = ? WHERE id = ?',
            [nombre, idcategoria, idestatus, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Subcategoría no encontrada' });
        res.json({ mensaje: 'Subcategoría actualizada' });
    } catch (error) {
        next(error);
    }
};

export const deleteSubcategoria = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM subcategorias WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Subcategoría no encontrada' });
        res.json({ mensaje: 'Subcategoría eliminada' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar la subcategoría porque tiene productos asociados' });
        }
        next(error);
    }
};