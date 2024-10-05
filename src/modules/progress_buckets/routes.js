const express = require('express');
const responded = require('../../red/response'); // Controlador de respuestas
const controller = require('./Controller'); // Controlador de progress_buckets
const authenticateToken = require('../../authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Obtener todos los progresos de buckets
router.get('/', authenticateToken, async (req, res) => {
    try {
        const progressBuckets = await controller.getAllProgressBuckets();
        responded.success(req, res, progressBuckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los progresos de buckets', 500);
    }
});

// Obtener un progreso de bucket por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const progressBucket = await controller.getProgressBucketById(req.params.id);
        if (progressBucket) {
            responded.success(req, res, progressBucket, 200);
        } else {
            responded.error(req, res, 'Progreso de bucket no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al obtener el progreso del bucket', 500);
    }
});

// Crear un nuevo progreso de bucket
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newProgressBucket = await controller.createProgressBucket(req.body);
        responded.success(req, res, newProgressBucket, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear el progreso del bucket', 500);
    }
});

// Actualizar un progreso de bucket existente
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedProgressBucket = await controller.updateProgressBucket(req.params.id, req.body);
        if (updatedProgressBucket) {
            responded.success(req, res, 'Progreso del bucket actualizado exitosamente', 200);
        } else {
            responded.error(req, res, 'Progreso de bucket no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar el progreso del bucket', 500);
    }
});

// Eliminar un progreso de bucket
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteProgressBucket(req.params.id);
        if (result) {
            responded.success(req, res, 'Progreso del bucket eliminado exitosamente', 200);
        } else {
            responded.error(req, res, 'Progreso de bucket no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar el progreso del bucket', 500);
    }
});

module.exports = router;
