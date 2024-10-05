const express = require('express');
const responded = require('../../red/response'); // Control de respuestas
const controller = require('./Controller'); // Controlador de progress_task
const authenticateToken = require('../../authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Obtener todos los progresos de tareas
router.get('/', authenticateToken, async (req, res) => {
    try {
        const progressTasks = await controller.getAllProgressTasks();
        responded.success(req, res, progressTasks, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los progresos de tareas', 500);
    }
});

// Obtener el progreso de una tarea por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const progressTask = await controller.getProgressTaskById(req.params.id);
        if (progressTask) {
            responded.success(req, res, progressTask, 200);
        } else {
            responded.error(req, res, 'Progreso de tarea no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al obtener el progreso de la tarea', 500);
    }
});

// Crear un nuevo progreso para una tarea
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newProgressTask = await controller.createProgressTask(req.body);
        responded.success(req, res, newProgressTask, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear el progreso de la tarea', 500);
    }
});

// Actualizar un progreso de tarea existente
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedProgressTask = await controller.updateProgressTask(req.params.id, req.body);
        if (updatedProgressTask) {
            responded.success(req, res, 'Progreso de tarea actualizado exitosamente', 200);
        } else {
            responded.error(req, res, 'Progreso de tarea no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar el progreso de la tarea', 500);
    }
});

// Eliminar un progreso de tarea
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteProgressTask(req.params.id);
        if (result) {
            responded.success(req, res, 'Progreso de tarea eliminado exitosamente', 200);
        } else {
            responded.error(req, res, 'Progreso de tarea no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar el progreso de la tarea', 500);
    }
});

module.exports = router;
