import pool from '../config/db.js';

export const getAllUsuarios = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, email, telefono, created_at FROM usuarios ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getUsuarioById = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, email, telefono, created_at FROM usuarios WHERE id = ?', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createUsuario = async (req, res, next) => {
    try {
        const { nombre, email, telefono } = req.body;
        if (!nombre || !email) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email' });
        }
        const [existente] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)',
            [nombre, email, telefono || null]
        );
        res.status(201).json({ id: result.insertId, nombre, email, telefono: telefono || null });
    } catch (error) {
        next(error);
    }
};

export const updateUsuario = async (req, res, next) => {
    try {
        const { nombre, email, telefono } = req.body;
        const [existente] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, req.params.id]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Ya existe otro usuario con ese email' });
        }
        const [result] = await pool.query(
            'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
            [nombre, email, telefono, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (error) {
        next(error);
    }
};

export const deleteUsuario = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        next(error);
    }
};