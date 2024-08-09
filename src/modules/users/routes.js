const express = require('express');

const responded = require('../../red/response')
const controller = require('./Controller')

const router = express.Router();

router.get('/', async function(req,res){
    try{
        const allUsers = await controller.getAll();
        responded.success(req, res, allUsers,200)
    }
    catch(err){
        responded.error(req, res, err, 500);
    }    
});

router.get('/:id', async function(req,res){
    try{
        const User = await controller.getUser(req.params.id);
        responded.success(req, res, User,200)
    }
    catch(err){
        responded.error(req, res, err, 500);
    }    
});

module.exports = router;