const express = require('express');
const responded = require('../../red/response'); // Controlador de respuestas
const controller = require('./Controller'); // Controlador que maneja la lógica de reports
const authenticateToken = require('../../authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Obtener todos los informes
router.get('/', authenticateToken, async (req, res) => {
    try {
        const reports = await controller.getAllReports();
        responded.success(req, res, reports, 200);
    } catch (err) {
        responded.error(req, res, 'Error al obtener los informes', 500);
    }
});

// Obtener un informe por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const report = await controller.getReportById(req.params.id);
        if (report.length > 0) { // Asegúrate de que el resultado sea un array con al menos un elemento
            responded.success(req, res, report[0], 200);
        } else {
            responded.error(req, res, 'Informe no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al obtener el informe', 500);
    }
});

// Crear un nuevo informe
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newReport = await controller.createReport(req.body);
        responded.success(req, res, newReport, 201);
    } catch (err) {
        responded.error(req, res, 'Error al crear el informe', 500);
    }
});

// Actualizar un informe existente
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updated = await controller.updateReport(req.params.id, req.body);
        if (updated) {
            responded.success(req, res, 'Informe actualizado exitosamente', 200);
        } else {
            responded.error(req, res, 'Informe no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al actualizar el informe', 500);
    }
});

// Eliminar un informe
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await controller.deleteReport(req.params.id);
        if (deleted) {
            responded.success(req, res, 'Informe eliminado exitosamente', 200);
        } else {
            responded.error(req, res, 'Informe no encontrado', 404);
        }
    } catch (err) {
        responded.error(req, res, 'Error al eliminar el informe', 500);
    }
});

module.exports = router;
