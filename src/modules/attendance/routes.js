const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, async function(req, res) {
    try {
        const allAttendance = await controller.getAll();
        responded.success(req, res, allAttendance, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

router.get('/:id', authenticateToken, async function(req, res) {
    try {
        const attendance = await controller.getAttendance(req.params.id);
        responded.success(req, res, attendance, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

router.post('/', authenticateToken, async function(req, res) {
    try {
        const newAttendance = await controller.createAttendance(req.body);
        responded.success(req, res, newAttendance, 201);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

router.delete('/:id', authenticateToken, async function(req, res) {
    try {
        const deleted = await controller.deleteAttendance(req.params.id);
        if (deleted) {
            responded.success(req, res, `Attendance deleted successfully`, 200);
        } else {
            responded.error(req, res, `Attendance not found`, 404);
        }
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

module.exports = router;
