const express = require('express');
const { check, validationResult } = require('express-validator');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Obtener todas las asistencias (Admins only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const attendances = await controller.getAll();
        responded.success(req, res, attendances, 200);
    } catch (err) {
        console.error('Error al obtener asistencias:', err.message);
        responded.error(req, res, 'Hubo un problema al obtener las asistencias', 500);
    }
});

// Obtener una asistencia por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const attendance = await controller.getAttendance(req.params.id);
        responded.success(req, res, attendance, 200);
    } catch (err) {
        console.error('Error al obtener asistencia:', err.message);
        responded.error(req, res, 'Hubo un problema al obtener la asistencia', 500);
    }
});

// Crear una nueva asistencia (check-in)
router.post(
    '/',
    authenticateToken,
    [
        check('user_id')
            .isInt().withMessage('El ID de usuario debe ser un número entero')
            .not().isEmpty().withMessage('El ID de usuario es obligatorio'),
        check('check_in')
            .isISO8601().withMessage('El formato de la fecha de check-in es incorrecto')
            .not().isEmpty().withMessage('El check-in es obligatorio'),
        check('location.lat')
            .isFloat({ min: -90, max: 90 }).withMessage('La latitud debe estar entre -90 y 90')
            .not().isEmpty().withMessage('La latitud es obligatoria'),
        check('location.lng')
            .isFloat({ min: -180, max: 180 }).withMessage('La longitud debe estar entre -180 y 180')
            .not().isEmpty().withMessage('La longitud es obligatoria')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const attendanceExists = await controller.checkAttendanceToday(req.body.user_id);
            if (attendanceExists) {
                return responded.error(req, res, 'Ya has registrado asistencia para hoy', 400);
            }
            const newAttendance = await controller.createAttendance(req.body);
            responded.success(req, res, newAttendance, 201);
        } catch (err) {
            console.error('Error al crear asistencia:', err.message);
            responded.error(req, res, 'Hubo un problema al crear la asistencia', 500);
        }
    }
);

// Actualizar asistencia (check-out con fecha y hora)
router.put(
    '/:id',
    authenticateToken,
    [
        // Validar que check_out sea una fecha y hora en formato ISO8601
        check('check_out')
            .isISO8601().withMessage('El formato de la fecha y hora de check-out es incorrecto')
            .not().isEmpty().withMessage('El campo check-out es obligatorio')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedAttendance = await controller.updateAttendance(req.params.id, req.body);
            if (updatedAttendance) {
                responded.success(req, res, `Asistencia actualizada exitosamente`, 200);
            } else {
                responded.error(req, res, `No se encontró la asistencia`, 404);
            }
        } catch (err) {
            console.error('Error al actualizar asistencia:', err.message);
            responded.error(req, res, 'Hubo un problema al actualizar la asistencia', 500);
        }
    }
);

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

// Verificar asistencia del día (check-in único)
router.get('/today/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const attendanceExists = await controller.checkAttendanceToday(userId);
        res.json({ attendanceExists });
    } catch (error) {
        responded.error(req, res, error.message || 'Error al verificar la asistencia de hoy', 500);
    }
});

module.exports = router;
