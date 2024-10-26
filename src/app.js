const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');

// Importa todas las rutas
const userRoutes = require('./modules/users/routes');
const attendanceRoutes = require('./modules/attendance/routes');
const taskRoutes = require('./modules/task/routes');
const userBucketRoutes = require('./modules/user_buckets/routes');
const bucketRoutes = require('./modules/buckets/routes');
const taskBucketRoutes = require('./modules/task_buckets/routes');
const progressBucketRoutes = require('./modules/progress_buckets/routes');
const contingenciesRoutes = require('./modules/contigencies/routes');
const progressTaskRoutes = require('./modules/progress_task/routes');
const reportsRoutes = require('./modules/reports/routes');
const progressContingenciesRoutes = require('./modules/progress_contingencies/routes');
const authenticateToken = require('./authMiddleware');

const app = express();

// Middleware para permitir CORS desde múltiples orígenes
app.use(cors({
    origin: [
        'https://react-weeb-59a5zoags-roy2995s-projects.vercel.app/',
        'https://react-weeb-59a5zoags-roy2995s-projects.vercel.app',
        'http://localhost:5173/',
        'https://react-weeb-m2nf2ajke-roy2995s-projects.vercel.app/'
    ]
}));

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
app.use('/api/progress_buckets', progressBucketRoutes);
app.use('/api/progress_tasks', authenticateToken, progressTaskRoutes);
app.use('/api/contingencies', contingenciesRoutes);
app.use('/api/reports', authenticateToken, reportsRoutes);
app.use('/api/progress_contingencies', authenticateToken, progressContingenciesRoutes);

module.exports = app;
