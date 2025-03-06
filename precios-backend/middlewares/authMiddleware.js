const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // Extraemos el token del encabezado Authorization
    const token = req.header('Authorization')?.split(' ')[1];  // Esto separa 'Bearer' y el token

    if (!token) return res.status(401).json({ message: 'Acceso denegado. No hay token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Agregamos la info del usuario al request
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' });
    }
};


module.exports = authMiddleware;
