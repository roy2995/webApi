const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todos los user_buckets
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userBuckets = await controller.getAllUserBuckets();
        responded.success(req, res, userBuckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los user_buckets', 500);
    }
});

// Obtener buckets por ID de usuario
router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const userBuckets = await controller.getBucketsByUserId(req.params.userId);
        responded.success(req, res, userBuckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los buckets del usuario', 500);
    }
});

// Crear nuevo user_bucket
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newUserBucket = await controller.createUserBucket(req.body);
        responded.success(req, res, newUserBucket, 201);
    } catch (err) {
        responded.error(req, res, 'Error al asignar bucket al usuario', 500);
    }
});

// Eliminar user_bucket
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteUserBucket(req.params.id);
        if (result) {
            responded.success(req, res, 'User_bucket eliminado exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró el user_bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar el user_bucket', 500);
    }
});

// Actualizar el bucket_id de un user_bucket
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { bucket_id } = req.body;

    if (!bucket_id) {
        return responded.error(req, res, 'El bucket_id es obligatorio', 400);
    }

    try {
        const result = await controller.updateBucketId(id, bucket_id);
        if (result) {
            responded.success(req, res, 'El bucket_id fue actualizado exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró el user_bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar el bucket_id', 500);
    }
});

module.exports = router;
