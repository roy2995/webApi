const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todos los grupos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const groups = await controller.getAllGroups();
        responded.success(req, res, groups, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los grupos', 500);
    }
});

// Obtener un grupo por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const group = await controller.getGroupById(req.params.id);
        responded.success(req, res, group, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener el grupo', 500);
    }
});

module.exports = router;
