const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener todos los productos
router.get('/', (req, res) => {
    db.query('SELECT * FROM presentacion', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});


// Crear un nuevo producto
router.post('/', (req, res) => {
    const { nombre } = req.body;

    if (!nombre ) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    db.query(
        'INSERT INTO productos (nombre) VALUES (?)', 
        [nombre], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar la presentación' });
            }
            res.json({ id_presentacion: result.insertId, nombre });
        }
    );
});

// Actualizar un producto
router.put('/:id_presentacion', (req, res) => {
    const { nombre } = req.body;
    const { id_presentacion } = req.params;
    db.query('UPDATE productos SET nombre = ? WHERE id_presentacion = ?', [nombre, id_presentacion], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Producto actualizado' });
    });
});



// Eliminar un producto
router.delete('/:id_presentacion', (req, res) => {
    const { id_presentacion } = req.params;
    db.query('DELETE FROM presentacion WHERE id_presentacion = ?', [id_presentacion], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Producto eliminado' });
    });
});

module.exports = router;
