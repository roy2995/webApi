const express = require('express');

const responded = require('../../red/response')
const controller = require('./Controller')

const router = express.Router();

router.get('/', function(req,res){
    const allUsers = controller.getAll();
    responded.success(req, res, allUsers,200)
    
});

module.exports = router;