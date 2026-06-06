import pool from '../config/db.js';

// GET /usuarios
export const getAllUsuarios = async (req, res, next) => {
    try {
        // Selecciona solo las columnas existentes en tu tabla
        const [rows] = await pool.query(`
            SELECT id, nombre, correo 
            FROM usuarios 
            ORDER BY nombre ASC
        `);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

// GET /usuarios/:id
export const getUsuarioById = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, nombre, correo 
            FROM usuarios 
            WHERE id = ?
        `, [req.params.id]);
        
        if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

// POST /usuarios
export const createUsuario = async (req, res, next) => {
    const { nombre, correo, clave } = req.body;
    
    // Validación estricta: los tres campos son NOT NULL en tu BD
    if (!nombre || !correo || !clave) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, correo o clave' });
    }
    
    try {
        const [result] = await pool.query(
            `INSERT INTO usuarios (nombre, correo, clave) VALUES (?, ?, ?)`,
            [nombre, correo, clave]
        );
        // Retornamos el ID asignado junto con los datos (ocultando la clave por seguridad)
        res.status(201).json({ id: result.insertId, nombre, correo });
    } catch (error) {
        // Captura el error si el correo ya existe (llave duplicada)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }
        next(error);
    }
};

// PUT /usuarios/:id
export const updateUsuario = async (req, res, next) => {
    const { nombre, correo, clave } = req.body;
    
    if (!nombre || !correo || !clave) {
        return res.status(400).json({ error: 'Todos los campos (nombre, correo, clave) son obligatorios para actualizar' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE usuarios SET nombre = ?, correo = ?, clave = ? WHERE id = ?`,
            [nombre, correo, clave, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado con éxito' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso por otro usuario' });
        }
        next(error);
    }
};

// DELETE /usuarios/:id
export const deleteUsuario = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
        // Manejo de restricciones de clave foránea en MySQL
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene registros asociados en el sistema' });
        }
        next(error);
    }
};