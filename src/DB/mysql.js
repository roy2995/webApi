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

// Función genérica para ejecutar cualquier consulta
function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

// Consultas específicas para usuarios
function all(table) {
    const query = `SELECT * FROM \`${table}\``;
    return executeQuery(query);
}

function user(table, id) {
    const query = `SELECT * FROM \`${table}\` WHERE id = ?`;
    return executeQuery(query, [id]);
}

function newUser(table, data) {
    const query = `INSERT INTO \`${table}\` SET ?`;
    return executeQuery(query, data).then(result => ({ id: result.insertId, ...data }));
}

function delet(table, condition, params) {
    const query = `DELETE FROM \`${table}\` WHERE ${condition}`;
    return executeQuery(query, params).then(result => result.affectedRows > 0);
}

function login(sql, params) {
    return executeQuery(sql, params);
}

function updateBuketsGroup(table, username, newBuketsId) {
    const query = `UPDATE \`${table}\` SET bukets_id = ? WHERE username = ?`;
    return executeQuery(query, [newBuketsId, username]).then(result => result.affectedRows > 0);
}

function updatePassword(id, newPassword) {
    const query = `UPDATE users SET password = ? WHERE id = ?`;
    return executeQuery(query, [newPassword, id]).then(result => result.affectedRows > 0);
}

function allUsers(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM \`${table}\``, (error, result) => {
            if (error) return reject(error);
            resolve(result);
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
    updateBuketsGroup,
    updatePassword,
    executeQuery
};
