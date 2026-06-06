import pool from '../config/db.js';

export const getAllGeneros = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT g.id, g.nombre, g.descripcion, g.estatus_id, e.nombre AS estatus
            FROM generos g
            JOIN estatus e ON g.estatus_id = e.id
            ORDER BY g.nombre ASC
        `);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getGeneroById = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT g.*, e.nombre AS estatus
            FROM generos g
            JOIN estatus e ON g.estatus_id = e.id
            WHERE g.id = ?
        `, [req.params.id]);
        
        if (!rows[0]) return res.status(404).json({ error: 'Género no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createGenero = async (req, res, next) => {
    const { nombre, descripcion, estatus_id } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: 'Falta campo obligatorio: nombre' });
    }
    try {
        const [result] = await pool.query(
            `INSERT INTO generos (nombre, descripcion, estatus_id) VALUES (?, ?, ?)`,
            [nombre, descripcion || null, estatus_id || 1]
        );
        res.status(201).json({ id: result.insertId, nombre, descripcion, estatus_id: estatus_id || 1 });
    } catch (error) {
        next(error);
    }
};

export const updateGenero = async (req, res, next) => {
    const { nombre, descripcion, estatus_id } = req.body;
    try {
        const [result] = await pool.query(
            `UPDATE generos SET nombre = ?, descripcion = ?, estatus_id = ? WHERE id = ?`,
            [nombre, descripcion, estatus_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Género no encontrado' });
        res.json({ mensaje: 'Género actualizado' });
    } catch (error) {
        next(error);
    }
};

export const deleteGenero = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM generos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Género no encontrado' });
        res.json({ mensaje: 'Género eliminado' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ error: 'No se puede eliminar el género porque tiene juegos asociados' });
        }
        next(error);
    }
};