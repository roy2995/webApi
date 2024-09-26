const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todas las relaciones entre tareas y buckets
router.get('/', authenticateToken, async (req, res) => {
    try {
        const taskBuckets = await controller.getAllTaskBuckets();
        responded.success(req, res, taskBuckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener las relaciones de task_buckets', 500);
    }
});

// Obtener las relaciones de una tarea con los buckets asociados
router.get('/:task_id', authenticateToken, async (req, res) => {
    try {
        const taskBuckets = await controller.getTaskBucketsByTaskId(req.params.task_id);
        responded.success(req, res, taskBuckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener las relaciones de la tarea con buckets', 500);
    }
});

// Crear una nueva relación entre tarea y bucket
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newTaskBucket = await controller.createTaskBucket(req.body);
        responded.success(req, res, newTaskBucket, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear la relación entre tarea y bucket', 500);
    }
});

// Actualizar una relación entre tarea y bucket
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedTaskBucket = await controller.updateTaskBucket(req.params.id, req.body);
        if (updatedTaskBucket) {
            responded.success(req, res, 'Relación entre tarea y bucket actualizada exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró la relación entre tarea y bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar la relación entre tarea y bucket', 500);
    }
});

// Eliminar una relación entre tarea y bucket
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteTaskBucket(req.params.id);
        if (result) {
            responded.success(req, res, 'Relación entre tarea y bucket eliminada exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró la relación entre tarea y bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar la relación entre tarea y bucket', 500);
    }
});

module.exports = router;
