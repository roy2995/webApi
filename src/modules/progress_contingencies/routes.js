const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todos los progresos de contingencias
router.get('/', authenticateToken, async (req, res) => {
    try {
        const progressContingencies = await controller.getAllProgressContingencies();
        responded.success(req, res, progressContingencies, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los progresos de contingencias', 500);
    }
});

// Obtener un progreso de contingencia por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const progressContingency = await controller.getProgressContingencyById(req.params.id);
        responded.success(req, res, progressContingency, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener el progreso de la contingencia', 500);
    }
});

// Crear un nuevo progreso para una contingencia
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newProgressContingency = await controller.createProgressContingency(req.body);
        responded.success(req, res, newProgressContingency, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear el progreso de la contingencia', 500);
    }
});

// Actualizar un progreso de contingencia existente
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedProgressContingency = await controller.updateProgressContingency(req.params.id, req.body);
        if (updatedProgressContingency) {
            responded.success(req, res, 'Progreso de la contingencia actualizado exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró el progreso de la contingencia', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar el progreso de la contingencia', 500);
    }
});

// Eliminar un progreso de contingencia
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteProgressContingency(req.params.id);
        if (result) {
            responded.success(req, res, 'Progreso de la contingencia eliminado exitosamente', 200);
        } else {
            responded.error(req, res, 'No se encontró el progreso de la contingencia', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar el progreso de la contingencia', 500);
    }
});

module.exports = router;
