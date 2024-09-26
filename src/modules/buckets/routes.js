const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todos los buckets
router.get('/', authenticateToken, async (req, res) => {
    try {
        const buckets = await controller.getAllBuckets();
        responded.success(req, res, buckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los buckets', 500);
    }
});

// Obtener un bucket por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const bucket = await controller.getBucketById(req.params.id);
        responded.success(req, res, bucket, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener el bucket', 500);
    }
});

// Crear un nuevo bucket
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newBucket = await controller.createBucket(req.body);
        responded.success(req, res, newBucket, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear el bucket', 500);
    }
});

// Actualizar un bucket existente
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedBucket = await controller.updateBucket(req.params.id, req.body);
        if (updatedBucket) {
            responded.success(req, res, 'Bucket actualizado exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró el bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar el bucket', 500);
    }
});

// Eliminar un bucket
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteBucket(req.params.id);
        if (result) {
            responded.success(req, res, 'Bucket eliminado exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró el bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar el bucket', 500);
    }
});

module.exports = router;
