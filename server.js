const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

const contactsRoutes = require('./routes/contacts');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad y configuración
app.use(helmet());

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging básico
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas
app.get('/', (req, res) => {
    res.json({
        message: 'API de Agenda de Contactos',
        version: '1.0.0',
        endpoints: {
            contacts: '/api/contacts',
            health: '/health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Rutas de contactos
app.use('/api/contacts', contactsRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
    console.log(`Base de datos: ${process.env.DB_NAME}`);
});

module.exports = app;
