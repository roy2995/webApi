const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

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

// Obtener el progreso de un bucket por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const progressBucket = await controller.getProgressBucketById(req.params.id);
        responded.success(req, res, progressBucket, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener el progreso del bucket', 500);
    }
});

// Crear un nuevo progreso para un bucket
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
            responded.error(req, res, 'No se encontró el progreso del bucket', 404);
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
            responded.error(req, res, 'No se encontró el progreso del bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar el progreso del bucket', 500);
    }
});

module.exports = router;
