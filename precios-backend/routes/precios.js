const express = require('express');
const router = express.Router();
const db = require('../db/db');


// Obtener todos los precios diarios
router.get('/getprecio', (req, res) => {
    const query = `
        SELECT 
            precios_diarios.id, 
            precios_diarios.producto_id, 
            precios_diarios.fecha, 
            precios_diarios.id_presentacion_per, 
            precios_diarios.peso, 
            precios_diarios.precio, 
            productos.nombre AS producto_nombre,
            presentacion.nombre AS presentacion_nombre
        FROM precios_diarios 
        JOIN productos ON precios_diarios.producto_id = productos.id
        JOIN presentacion ON precios_diarios.id_presentacion_per = presentacion.id_presentacion
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener precios diarios:', err);
            return res.status(500).json({ error: 'Error al obtener los precios diarios' });
        }
        res.json(results);
    });
});


// Insertar un nuevo precio diario
router.post('/addprecio', (req, res) => {
    const { producto_id, fecha, id_presentacion_per, peso, precio } = req.body;
    db.query(
        'INSERT INTO precios_diarios (producto_id, fecha, id_presentacion_per, peso, precio) VALUES (?, ?, ?, ?, ?)',
        [producto_id, fecha, id_presentacion_per, peso, precio],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, producto_id, fecha, id_presentacion_per, peso, precio });
        }
    );
});

// Actualizar un precio diario
router.put('/putprecio/:id', (req, res) => {
    const { id_presentacion_per, peso, precio } = req.body;
    const { id } = req.params;
    db.query(
        'UPDATE precios_diarios SET id_presentacion_per = ?, peso = ?, precio = ? WHERE id = ?',
        [id_presentacion_per, peso, precio, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Precio actualizado' });
        }
    );
});

// Eliminar un precio diario
router.delete('/deleteprecio/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM precios_diarios WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Precio eliminado' });
    });
});

module.exports = router;
