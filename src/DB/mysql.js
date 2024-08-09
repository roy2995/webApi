const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

let connection;

function conMysql() {
    connection = mysql.createConnection(dbconfig);

    connection.connect((err) => {
        if (err) {
            console.log(['db err'], err);
            setTimeout(conMysql, 20000); 
        } else {
            console.log("db connected");
        }
    });

    connection.on('error', err => {
        console.log('[db err]', err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql();
        } else {
            throw err;
        }
    });
}

conMysql();

function all(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ??`, [table], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

function user(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ?? WHERE id = ?`, [table, id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);
        });
    });
}

function newUser(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ?? SET ?`, [table, data], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

function delet(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ?? WHERE id = ?`, [table, id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = {
    all,
    user,
    newUser,
    delet
};
