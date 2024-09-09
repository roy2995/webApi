const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todas las asistencias
router.get('/', authenticateToken, async (req, res) => {
    try {
        const attendances = await controller.getAllAttendance();
        responded.success(req, res, attendances, 200);
    } catch (err) {
        console.error('Error al obtener asistencias:', err.message);
        responded.error(req, res, 'Hubo un problema al obtener las asistencias', 500);
    }
});

// Obtener una asistencia por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const attendance = await controller.getAttendanceById(req.params.id);
        responded.success(req, res, attendance, 200);
    } catch (err) {
        console.error('Error al obtener asistencia:', err.message);
        responded.error(req, res, 'Hubo un problema al obtener la asistencia', 500);
    }
});

// Obtener asistencia por nombre de usuario
router.get('/user/:username', authenticateToken, async (req, res) => {
    try {
        const attendances = await controller.getAttendanceByUsername(req.params.username);
        if (attendances.length > 0) {
            responded.success(req, res, attendances, 200);
        } else {
            responded.error(req, res, 'No se encontraron registros de asistencia para este usuario', 404);
        }
    } catch (err) {
        console.error('Error al obtener asistencia por usuario:', err.message);
        responded.error(req, res, 'Hubo un problema al obtener la asistencia por usuario', 500);
    }
});

// Crear una nueva asistencia (iniciar turno)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newAttendance = await controller.createAttendance(req.body);
        responded.success(req, res, newAttendance, 201);
    } catch (err) {
        console.error('Error al crear asistencia:', err.message);
        responded.error(req, res, 'Hubo un problema al crear la asistencia', 500);
    }
});

// Finalizar turno (actualizar asistencia con hora de salida)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedAttendance = await controller.updateAttendance(req.params.id, req.body);
        responded.success(req, res, updatedAttendance, 200);
    } catch (err) {
        console.error('Error al actualizar asistencia:', err.message);
        responded.error(req, res, 'Hubo un problema al actualizar la asistencia', 500);
    }
});

// Eliminar una asistencia por ID
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteAttendance(req.params.id);
        if (result) {
            responded.success(req, res, `Asistencia eliminada con éxito`, 200);
        } else {
            responded.error(req, res, `No se encontró la asistencia`, 404);
        }
    } catch (err) {
        console.error('Error al eliminar asistencia:', err.message);
        responded.error(req, res, 'Hubo un problema al eliminar la asistencia', 500);
    }
});

router.get('/today/:userId', authenticateToken, async function(req, res) {
    try {
        const { userId } = req.params;
        const attendanceExists = await controller.checkAttendanceToday(userId);
        res.json({ attendanceExists });
    } catch (error) {
        responded.error(req, res, error.message || 'Error al verificar la asistencia de hoy', 500);
    }
});

module.exports = router;
