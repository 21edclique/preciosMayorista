const express = require('express');
const db = require('../db/db');

const router = express.Router();

// Obtener todos los usuarios
router.get('/', (req, res) => {
    db.query('SELECT Usuarios.id, Usuarios.nombres, Usuarios.usuario,Usuarios.password , Usuarios.id_rol, Roles.nombre_rol FROM usuarios JOIN Roles ON Usuarios.id_rol=Roles.id', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Registrar un nuevo usuario
router.post('/registrar', (req, res) => {
    const { nombres, usuario, password, id_rol} = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Insertar nuevo usuario sin encriptar la contraseña
        db.query(
            'INSERT INTO usuarios (nombres, usuario, password, id_rol) VALUES (?, ?, ?, ?)',
            [nombres, usuario, password, id_rol],
            (err, result) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Usuario registrado', id: result.insertId });
            }
        );
    });
});




// Actualizar un usuario
router.put('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, usuario, password, id_rol } = req.body;

    // Verificar si el usuario existe
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar usuario
        const query = `
            UPDATE usuarios
            SET nombres = ?, usuario = ?, password = ?, id_rol = ?
            WHERE id = ?
        `;
        db.query(query, [nombres, usuario, password, id_rol, id], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Usuario actualizado' });
        });
    });
});


// Eliminar un usuario
router.delete('/eliminar/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario eliminado' });
    });
});



module.exports = router;
