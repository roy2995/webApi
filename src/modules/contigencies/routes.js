const express = require('express');
const responded = require('../../red/response'); // Manejador de respuestas
const controller = require('./Controller'); // Controlador de contingencias
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Rutas GET sin autenticación
// Obtener todas las contingencias
router.get('/', async (req, res) => {
    try {
        const contingencies = await controller.getAllContingencies();
        responded.success(req, res, contingencies, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener las contingencias', 500);
    }
});

// Obtener una contingencia por ID sin autenticación
router.get('/:id', async (req, res) => {
    try {
        const contingency = await controller.getContingencyById(req.params.id);
        responded.success(req, res, contingency, 200);
    } catch (err) {
        responded.error(req, res, err.message, 404);
    }
});

// Rutas protegidas por autenticación
// Crear una nueva contingencia
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newContingency = await controller.createContingency(req.body);
        responded.success(req, res, newContingency, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear la contingencia', 500);
    }
});

// Actualizar una contingencia por ID
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updated = await controller.updateContingency(req.params.id, req.body.name);
        if (updated) {
            responded.success(req, res, 'Contingencia actualizada exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró la contingencia', 404);
        }
    } catch (err) {
        responded.error(req, res, err.message, 500);
    }
});

// Eliminar una contingencia por ID
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await controller.deleteContingency(req.params.id);
        if (deleted) {
            responded.success(req, res, 'Contingencia eliminada exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró la contingencia', 404);
        }
    } catch (err) {
        responded.error(req, res, err.message, 500);
    }
});

module.exports = router;
