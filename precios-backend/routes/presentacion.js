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

// Obtener todos los productos activos
router.get('/activo', (req, res) => {
    db.query('SELECT * FROM presentacion WHERE estado = 1', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});


// Crear un nuevo producto
router.post('/', (req, res) => {
    const { nombre,estado } = req.body;

    if (!nombre || !estado) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    db.query(
        'INSERT INTO presentacion (nombre,estado) VALUES (?,?)', 
        [nombre , estado], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar la presentación' });
            }
            res.json({ id_presentacion: result.insertId, nombre, estado });
        }
    );
});



// Actualizar un producto
router.put('/:id_presentacion', (req, res) => {
    const { nombre } = req.body;
    const { id_presentacion } = req.params;
    db.query('UPDATE presentacion SET nombre = ? WHERE id_presentacion = ?', [nombre, id_presentacion], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Producto actualizado' });
    });
});

// Ruta para cambiar el estado de un producto
router.put('/estado/:id_presentacion', (req, res) => {
    const { id_presentacion } = req.params;
    const { estado } = req.body;
  
    // Actualizar el estado en la base de datos
    db.query(
      'UPDATE presentacion SET estado = ? WHERE id_presentacion = ?',
      [estado, id_presentacion],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar el estado' });
        }
        res.json({ message: 'Estado actualizado correctamente' });
      }
    );
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
