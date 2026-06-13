import pool from '../config/db.js';

export const getAllMarcas = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM marcas ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getMarcaById = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM marcas WHERE id = ?', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ error: 'Marca no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createMarca = async (req, res, next) => {
    try {
        const { nombre, idestatus } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'Falta campo obligatorio: nombre' });
        }
        const [existente] = await pool.query('SELECT id FROM marcas WHERE nombre = ?', [nombre]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe una marca con ese nombre' });
        }
        const [result] = await pool.query(
            'INSERT INTO marcas (nombre, idestatus) VALUES (?, ?)',
            [nombre, idestatus || 1]
        );
        res.status(201).json({ id: result.insertId, nombre, idestatus: idestatus || 1 });
    } catch (error) {
        next(error);
    }
};

export const updateMarca = async (req, res, next) => {
    try {
        const { nombre, idestatus } = req.body;
        const [existente] = await pool.query('SELECT id FROM marcas WHERE nombre = ? AND id != ?', [nombre, req.params.id]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe otra marca con ese nombre' });
        }
        const [result] = await pool.query(
            'UPDATE marcas SET nombre = ?, idestatus = ? WHERE id = ?',
            [nombre, idestatus, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Marca no encontrada' });
        res.json({ mensaje: 'Marca actualizada' });
    } catch (error) {
        next(error);
    }
};

export const deleteMarca = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM marcas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Marca no encontrada' });
        res.json({ mensaje: 'Marca eliminada' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar la marca porque tiene productos asociados' });
        }
        next(error);
    }
};