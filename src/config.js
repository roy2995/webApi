require('dotenv').config();

const config = {
    app: {
        port: process.env.PORT || 4000  
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',  
        user: process.env.MYSQL_USER || 'root',
        port: process.env.MYSQL_PORT || 3306,  
        password: process.env.MYSQL_PASSWORD || 'vFds6NQBP-fwVRuW-dxfBb*j27CtKHniP4gFs6qgxTkkhzpFQmsgTbro2ijWG28YgaHdFE',
        database: process.env.MYSQL_DB || 'database'
    }
};

console.log('MySQL Config:', config.mysql);

module.exports = config;
