import pool from '../config/db.js';

export const getAllCategorias = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getCategoriaById = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createCategoria = async (req, res, next) => {
    try {
        const { nombre, descripcion, idestatus } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'Falta campo obligatorio: nombre' });
        }
        const [existente] = await pool.query('SELECT id FROM categorias WHERE nombre = ?', [nombre]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        }
        const [result] = await pool.query(
            'INSERT INTO categorias (nombre, descripcion, idestatus) VALUES (?, ?, ?)',
            [nombre, descripcion || null, idestatus || 1]
        );
        res.status(201).json({ id: result.insertId, nombre, descripcion, idestatus: idestatus || 1 });
    } catch (error) {
        next(error);
    }
};

export const updateCategoria = async (req, res, next) => {
    try {
        const { nombre, descripcion, idestatus } = req.body;
        const [existente] = await pool.query('SELECT id FROM categorias WHERE nombre = ? AND id != ?', [nombre, req.params.id]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe otra categoría con ese nombre' });
        }
        const [result] = await pool.query(
            'UPDATE categorias SET nombre = ?, descripcion = ?, idestatus = ? WHERE id = ?',
            [nombre, descripcion, idestatus, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría actualizada' });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoria = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar la categoría porque tiene registros asociados' });
        }
        next(error);
    }
};