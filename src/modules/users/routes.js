const express = require('express');
const responded = require('../../red/response');
const controller = require('./Controller');

const router = express.Router();

router.get('/', async function(req, res){
    try{
        const allUsers = await controller.getAll();
        responded.success(req, res, allUsers, 200);
    } catch(err){
        responded.error(req, res, err, 500);
    }    
});

router.get('/:id', async function(req, res){
    try{
        const user = await controller.getUser(req.params.id);
        responded.success(req, res, user, 200);
    } catch(err){
        responded.error(req, res, err, 500);
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
        const { username, password } = req.body;  
        const result = await controller.loginUser(username, password);

        if (result) {
            // Retornar el token y los datos del usuario
            responded.success(req, res, {
                user: result.user,
                token: result.token
            }, 200);
        } else {
            responded.error(req, res, 'Invalid username or password', 401);
        }
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});


module.exports = router;