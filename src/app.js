const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const users = require('./modules/users/routes');
const attendanceRoutes = require('./modules/attendance/routes');
const buketsGroups = require('./modules/bukets_groups/routes');
const authenticateToken = require('./authMiddleware');

const app = express();

// Middleware para permitir CORS
app.use(cors({
    origin: ' http://localhost:5173'
}));

app.use(cors());

// Otros middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del puerto
app.set('port', config.app.port);

// Rutas
app.use('/api/Users', users);
app.use('/api/attendance', authenticateToken, attendanceRoutes);

app.use('/api/BuketsGroups', buketsGroups);
app.use('/api/attendance', authenticateToken, attendanceRoutes);

module.exports = app;
