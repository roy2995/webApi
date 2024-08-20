const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allBuketsGroups = await controller.getAll();
        responded.success(req, res, allBuketsGroups, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

router.put('/', async (req, res) => {
    try {
        const { username, bukets_id } = req.body;

        if (!username || !bukets_id) {
            return responded.error(req, res, 'El username y el nuevo bukets_id son requeridos', 400);
        }

        const result = await controller.updateBukets(username, bukets_id);

        if (result) {
            responded.success(req, res, `bukets_id actualizado exitosamente`, 200);
        } else {
            responded.error(req, res, `No se encontró la entrada para el username proporcionado`, 404);
        }
    } catch (err) {
        console.log('Error en la solicitud:', err); 
        responded.error(req, res, err.message || 'Internal Server Error', 500);
    }
});




module.exports = router;
