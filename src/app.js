const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');

const userRoutes = require('./modules/users/routes');
const attendanceRoutes = require('./modules/attendance/routes');
const taskRoutes = require('./modules/task/routes');
const userBucketRoutes = require('./modules/user_buckets/routes');
const bucketRoutes = require('./modules/buckets/routes');
const taskBucketRoutes = require('./modules/task_buckets/routes');
const progressBucketRoutes = require('./modules/progress_buckets/routes');
const progressTaskRoutes = require('./modules/progress_task/routes');

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
app.use('/api/users', userRoutes);
app.use('/api/attendance', authenticateToken, attendanceRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/user_buckets', authenticateToken, userBucketRoutes);
app.use('/api/buckets', authenticateToken, bucketRoutes);
app.use('/api/task_buckets', authenticateToken, taskBucketRoutes);
app.use('/api/progress_buckets', authenticateToken, progressBucketRoutes);
app.use('/api/progress_tasks', authenticateToken, progressTaskRoutes);

module.exports = app;
