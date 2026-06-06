import pool from '../config/db.js';

export const getAllJuegos = async (req, res, next) => {
    try {
        const { genero_id, estatus_id, min_precio, max_precio } = req.query;
        let sql = `
        SELECT j.id, j.nombre, j.precio, j.valoracion, j.imagen, j.fechapublicacion,
               g.nombre AS genero, e.nombre AS estatus
        FROM juegos j
        JOIN generos g ON j.genero_id = g.id
        JOIN estatus e ON j.estatus_id = e.id
        WHERE 1=1`;
        const params = [];
        if (genero_id) { sql += ' AND j.genero_id = ?'; params.push(genero_id); }
        if (estatus_id) { sql += ' AND j.estatus_id = ?'; params.push(estatus_id); }
        if (min_precio) { sql += ' AND j.precio >= ?'; params.push(min_precio); }
        if (max_precio) { sql += ' AND j.precio <= ?'; params.push(max_precio); }
        sql += ' ORDER BY j.nombre ASC';
        
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getJuegoById = async (req, res, next) => {
    try {
        const [juego] = await pool.query(
            `SELECT j.*, g.nombre AS genero, e.nombre AS estatus
             FROM juegos j
             JOIN generos g ON j.genero_id = g.id
             JOIN estatus e ON j.estatus_id = e.id
             WHERE j.id = ?`,
            [req.params.id]
        );
        if (!juego[0]) return res.status(404).json({ error: 'Juego no encontrado' });
        
        const [plataformas] = await pool.query(
            `SELECT pl.id, pl.nombre FROM plataformas pl
             JOIN juegos_plataformas jp ON pl.id = jp.plataforma_id
             WHERE jp.juego_id = ?`,
            [req.params.id]
        );
        res.json({ ...juego[0], plataformas });
    } catch (error) {
        next(error);
    }
};

export const createJuego = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, genero_id, estatus_id, fechapublicacion, imagen } = req.body;
        if (!nombre || precio == null || !genero_id || !imagen) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, precio, genero_id, imagen' });
        }
        const [result] = await pool.query(
            `INSERT INTO juegos (nombre, descripcion, fechapublicacion, precio, imagen, genero_id, estatus_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, descripcion || null, fechapublicacion || null, precio, imagen, genero_id, estatus_id || 1]
        );
        res.status(201).json({ id: result.insertId, nombre, precio, genero_id, imagen });
    } catch (error) {
        next(error);
    }
};

export const updateJuego = async (req, res, next) => {
    try {
        const { nombre, descripcion, fechapublicacion, precio, valoracion, imagen, genero_id, estatus_id } = req.body;
        const [result] = await pool.query(
            `UPDATE juegos
             SET nombre=?, descripcion=?, fechapublicacion=?, precio=?, valoracion=?, imagen=?, genero_id=?, estatus_id=?
             WHERE id=?`,
            [nombre, descripcion, fechapublicacion, precio, valoracion, imagen, genero_id, estatus_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json({ mensaje: 'Juego actualizado' });
    } catch (error) {
        next(error);
    }
};

export const deleteJuego = async (req, res, next) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM juegos_plataformas WHERE juego_id = ?', [id]);
        const [result] = await pool.query('DELETE FROM juegos WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json({ mensaje: 'Juego y sus relaciones eliminados' });
    } catch (error) {
        next(error);
    }
};