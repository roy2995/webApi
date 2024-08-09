const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const users = require('./modules/users/routes')

const app = express();

//midelware
app.use(morgan('dev'));

//config
app.set('port', config.app.port)

//routes 
app.use('/api/Users', users)

module.exports = app;