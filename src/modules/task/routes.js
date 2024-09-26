const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todas las tareas
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await controller.getAllTasks();
        responded.success(req, res, tasks, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener las tareas', 500);
    }
});

// Obtener una tarea por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await controller.getTaskById(req.params.id);
        responded.success(req, res, task, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener la tarea', 500);
    }
});

// Crear una nueva tarea
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newTask = await controller.createTask(req.body);
        responded.success(req, res, newTask, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear la tarea', 500);
    }
});

// Actualizar una tarea existente
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedTask = await controller.updateTask(req.params.id, req.body);
        if (updatedTask) {
            responded.success(req, res, 'Tarea actualizada exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró la tarea', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar la tarea', 500);
    }
});

// Eliminar una tarea
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteTask(req.params.id);
        if (result) {
            responded.success(req, res, 'Tarea eliminada exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró la tarea', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar la tarea', 500);
    }
});

module.exports = router;
