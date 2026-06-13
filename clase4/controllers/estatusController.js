import pool from '../config/db.js';

export const getAllEstatus = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM estatus ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getEstatusById = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM estatus WHERE id = ?', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ error: 'Estatus no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createEstatus = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'Falta campo obligatorio: nombre' });
        }
        const [existente] = await pool.query('SELECT id FROM estatus WHERE nombre = ?', [nombre]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe un estatus con ese nombre' });
        }
        const [result] = await pool.query('INSERT INTO estatus (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ id: result.insertId, nombre });
    } catch (error) {
        next(error);
    }
};

export const updateEstatus = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const [existente] = await pool.query('SELECT id FROM estatus WHERE nombre = ? AND id != ?', [nombre, req.params.id]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe otro estatus con ese nombre' });
        }
        const [result] = await pool.query('UPDATE estatus SET nombre = ? WHERE id = ?', [nombre, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Estatus no encontrado' });
        res.json({ mensaje: 'Estatus actualizado' });
    } catch (error) {
        next(error);
    }
};

export const deleteEstatus = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM estatus WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Estatus no encontrado' });
        res.json({ mensaje: 'Estatus eliminado' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar el estatus porque tiene registros asociados' });
        }
        next(error);
    }
};