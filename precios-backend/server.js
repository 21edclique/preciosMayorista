const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const preciosRoutes = require('./routes/precios');
const rolesRoutes = require('./routes/roles');
const presentacionRoutes = require('./routes/presentacion');

const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes);
app.use('/productos', authMiddleware, productosRoutes);
app.use('/precios', authMiddleware, preciosRoutes);
app.use('/usuarios', authMiddleware, usuariosRoutes); // Agregar ruta de usuarios
app.use('/roles', authMiddleware, rolesRoutes); // Agregar ruta de roles
app.use('/presentacion', authMiddleware, presentacionRoutes); // Agregar ruta de presentacion   



const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
