const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');

const router = express.Router();

router.get('/', async function(req, res){
    try {
        const allUsers = await controller.getAll();
        responded.success(req, res, allUsers, 200);
    } catch(err){
        responded.error(req, res, err, 500);
    }    
});

router.get('/', async function(req, res){
    try {
        const { id, user_id } = req.query;

        if (!id && !user_id) {
            return responded.error(req, res, 'Must provide an ID or user_id', 400);
        }

        const user = await controller.getUser(id, user_id);
        if (user.length > 0) {
            responded.success(req, res, user[0], 200);  // Devuelve solo el primer usuario encontrado
        } else {
            responded.error(req, res, 'User not found', 404);
        }
    } catch (err) {
        responded.error(req, res, err.message, 500);
    }
});


router.post('/', async function(req, res){
    try {
        const newUser = await controller.createUser(req.body);
        responded.success(req, res, newUser, 201);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

router.delete('/', async function(req, res) {
    try {
        const { id, user } = req.query;

        if (!id && !user) {
            return responded.error(req, res, 'must provide an ID or username to delete', 400);
        }

        const result = await controller.deleteUser(id, user);

        if (result) {
            responded.success(req, res, `User successfully deleted`, 200);
        } else {
            responded.error(req, res, `User not found`, 404);
        }
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

router.post('/login', async function(req, res) {
    try {
        const { user_id, password } = req.body;
        const user = await controller.loginUser(user_id, password);

        if (user) {
            responded.success(req, res, user, 200);
        } else {
            responded.error(req, res, 'Invalid username or password', 401);
        }
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

module.exports = router;