const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Modificar el bukets_id de un usuario específico (Admins only)
router.put('/updateBuketsId/:userId', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return responded.error(req, res, 'Acceso denegado', 403);
    }

    const { userId } = req.params;
    const { buketsId } = req.body;

    try {
        const result = await controller.moveUserToAnotherGroup(userId, buketsId);
        if (result.affectedRows > 0) {
            responded.success(req, res, 'El bukets_id del usuario ha sido actualizado', 200);
        } else {
            responded.error(req, res, 'No se pudo actualizar el bukets_id del usuario', 500);
        }
    } catch (err) {
        console.error('Error al actualizar el bukets_id:', err);
        responded.error(req, res, 'Error al actualizar el bukets_id', 500);
    }
});

// Ver todos los usuarios que tienen un bukets_id (Admins only)
router.get('/withBuketsId', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return responded.error(req, res, 'Acceso denegado', 403);
    }

    try {
        const usersWithBuketsId = await controller.getUsersWithBuketsId();
        responded.success(req, res, usersWithBuketsId, 200);
    } catch (err) {
        console.error('Error al obtener usuarios con bukets_id:', err);
        responded.error(req, res, 'Error al obtener usuarios con bukets_id', 500);
    }
});

module.exports = router;
