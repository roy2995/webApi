const express = require('express');
const config = require('./config');

const users = require('./modules/users/routes')

const app = express();

//config
app.set('port', config.app.port)

//routes 
app.use('/api/Users', users)

module.exports = app;