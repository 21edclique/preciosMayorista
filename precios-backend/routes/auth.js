const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
require('dotenv').config();

const router = express.Router();


router.post("/login", (req, res) => {
    const { usuario, password } = req.body;

    db.query('SELECT * FROM Usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) return res.status(500).json({ error: "Error en la consulta", details: err });

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const usuarioDB = results[0];

        // 🔹 Comparar contraseñas sin encriptación
        if (password !== usuarioDB.password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // 🔹 Generar Token
        const token = jwt.sign(
            { id: usuarioDB.id, usuario: usuarioDB.usuario },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        // 🔹 Datos del usuario a enviar en la respuesta
        const userData = {
            id: usuarioDB.id,
            usuario: usuarioDB.usuario,
            nombres: usuarioDB.nombres,
            id_rol: usuarioDB.id_rol,
        };

        res.json({ message: "Login exitoso", token, userData });
    });
});

// 🔹 Logout (Solo lo manejamos en frontend eliminando el token)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout exitoso' });
});

module.exports = router;

