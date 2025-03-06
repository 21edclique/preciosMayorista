const express = require('express');
const db = require('../db/db');

const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM Roles', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre_rol } = req.body;
    db.query('INSERT INTO Roles (nombre_rol) VALUES (?)', [nombre_rol], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Rol agregado', id: results.insertId });
    });
});

module.exports = router;
