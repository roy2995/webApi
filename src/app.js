const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const authenticateToken = require('./authMiddleware');

// Importar las rutas
const attendanceRoutes = require('./modules/attendance/routes');
const userRoutes = require('./modules/users/routes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', config.app.port);

// Definir las rutas
app.use('/api/groups', authenticateToken, groupRoutes);
app.use('/api/userGroups', userGroupRoutes); 
app.use('/api/attendance', authenticateToken, attendanceRoutes);
app.use('/api/users', userRoutes); 

module.exports = app;  // Exportar la app correctamente
