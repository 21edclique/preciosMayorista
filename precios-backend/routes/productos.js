const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener todos los productos
router.get('/', (req, res) => {
    db.query('SELECT * FROM productos ', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Obtener todos los productos activos
router.get('/activo', (req, res) => {
    db.query('SELECT * FROM productos WHERE estado = 1', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});


// Crear un nuevo producto
router.post('/', (req, res) => {
    const { nombre, estado } = req.body;

    if (!nombre || !estado) {
        return res.status(400).json({ error: 'Nombre y estado son obligatorios' });
    }

    db.query(
        'INSERT INTO productos (nombre, estado) VALUES (?, ?)', 
        [nombre, estado], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar el producto' });
            }
            res.json({ id: result.insertId, nombre, estado });
        }
    );
});

// Actualizar un producto
router.put('/:id', (req, res) => {
    const { nombre } = req.body;
    const { id } = req.params;
    db.query('UPDATE productos SET nombre = ? WHERE id = ?', [nombre, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Producto actualizado' });
    });
});


// Ruta para cambiar el estado de un producto
router.put('/estado/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
  
    // Actualizar el estado en la base de datos
    db.query(
      'UPDATE productos SET estado = ? WHERE id = ?',
      [estado, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar el estado' });
        }
        res.json({ message: 'Estado actualizado correctamente' });
      }
    );
  });





// Eliminar un producto
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Producto eliminado' });
    });
});

module.exports = router;
