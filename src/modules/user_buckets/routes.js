const express = require('express');
const responded = require('../../red/response'); 
const controller = require('./Controller');

const router = express.Router();

// Obtener todos los user_buckets
router.get('/', async (req, res) => {
    try {
        const userBuckets = await controller.getAllUserBuckets();
        responded.success(req, res, userBuckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los user_buckets', 500);
    }
});

// Obtener buckets por ID de usuario
router.get('/:userId', async (req, res) => {
    try {
        const userBuckets = await controller.getBucketsByUserId(req.params.userId);
        responded.success(req, res, userBuckets, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los buckets del usuario', 500);
    }
});

// Crear un nuevo user_bucket
router.post('/', async (req, res) => {
    try {
        const newUserBucket = await controller.assignBucketToUser(req.body);
        responded.success(req, res, newUserBucket, 201);
    } catch (err) {
        responded.error(req, res, 'Error al asignar bucket al usuario', 500);
    }
});

// Eliminar un user_bucket
router.delete('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
    try {
        const updated = await controller.updateUserBucket(req.params.id, req.body.bucket_id);
        if (updated) {
            responded.success(req, res, 'User_bucket actualizado exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró el user_bucket', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar el user_bucket', 500);
    }
});

module.exports = router;
