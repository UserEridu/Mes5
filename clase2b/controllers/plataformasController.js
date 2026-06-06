import pool from '../config/db.js';

export const getAllPlataformas = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.nombre, p.descripcion, p.estatus_id, e.nombre AS estatus
            FROM plataformas p
            JOIN estatus e ON p.estatus_id = e.id
            ORDER BY p.nombre ASC
        `);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getPlataformaById = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, e.nombre AS estatus
            FROM plataformas p
            JOIN estatus e ON p.estatus_id = e.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (!rows[0]) return res.status(404).json({ error: 'Plataforma no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createPlataforma = async (req, res, next) => {
    const { nombre, descripcion, estatus_id } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: 'Falta campo obligatorio: nombre' });
    }
    try {
        const [result] = await pool.query(
            `INSERT INTO plataformas (nombre, descripcion, estatus_id) VALUES (?, ?, ?)`,
            [nombre, descripcion || null, estatus_id || 1]
        );
        res.status(201).json({ id: result.insertId, nombre, descripcion, estatus_id: estatus_id || 1 });
    } catch (error) {
        next(error);
    }
};

export const updatePlataforma = async (req, res, next) => {
    const { nombre, descripcion, estatus_id } = req.body;
    try {
        const [result] = await pool.query(
            `UPDATE plataformas SET nombre = ?, descripcion = ?, estatus_id = ? WHERE id = ?`,
            [nombre, descripcion, estatus_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Plataforma no encontrada' });
        res.json({ mensaje: 'Plataforma actualizada' });
    } catch (error) {
        next(error);
    }
};

export const deletePlataforma = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM plataformas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Plataforma no encontrada' });
        res.json({ mensaje: 'Plataforma eliminada' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ error: 'No se puede eliminar la plataforma porque tiene juegos asociados' });
        }
        next(error);
    }
};