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

            connection.query('SET SQL_SAFE_UPDATES = 0;', (err) => {
                if (err) {
                    console.error('Error al desactivar el modo seguro:', err);
                    return;
                }
                console.log('Modo seguro desactivado para esta conexión.');
            });
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

// Users query
function all(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM \`${table}\``, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function user(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function newUser(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO \`${table}\` SET ?`, data, (error, result) => {
            if (error) return reject(error);
            resolve({ id: result.insertId, ...data }); 
        });
    });
}

function delet(table, condition, params) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM \`${table}\` WHERE ${condition}`;
        connection.query(query, params, (error, result) => {
            if (error) return reject(error);
            resolve(result.affectedRows > 0); 
        });
    });
}

function login(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

// Buckets_group query
function allUsers(table){
    return new Promise((resolve, reject) =>{
        connection.query(`SELECT * FROM \`${table}\``,(error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    })
}


function updateBuketsGroup(table, username, newBuketsId) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE \`${table}\` SET bukets_id = ? WHERE username = ?`;
        connection.query(query, [newBuketsId, username], (error, result) => {
            if (error) {
                console.error('Error en la consulta SQL:', error);
                return reject(error);
            }
            resolve(result.affectedRows > 0);
        });
    });
}


module.exports = {
    all,
    user,
    newUser,
    delet,
    login,
    allUsers,
    updateBuketsGroup
}