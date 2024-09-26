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
            setTimeout(conMysql, 20000); // Si falla la conexión, intentamos reconectar
        } else {
            console.log("db connected");

            // Desactivar modo seguro
            connection.query('SET SQL_SAFE_UPDATES = 0;', (err) => {
                if (err) {
                    console.error('Error al desactivar el modo seguro:', err);
                    return;
                }
                console.log('Modo seguro desactivado para esta conexión.');
            });
        }
    });

    // Manejar los errores de la conexión
    connection.on('error', err => {
        console.log('[db err]', err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql(); // Reconectar automáticamente si la conexión se pierde
        } else {
            throw err;
        }
    });
}

conMysql();

// Función para cerrar la conexión
function endConnection() {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.end((err) => {
                if (err) return reject(err);
                console.log('Conexión a la base de datos cerrada.');
                resolve();
            });
        });
    }
}

// Función genérica para ejecutar cualquier consulta
function executeQuery(query, params = []) {
    console.log("Executing query:", query, "with params:", params); // Verificar las queries que se ejecutan
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

// Nueva función para actualizar usuarios o cualquier tabla
function update(table, data, condition, params) {
    const query = `UPDATE \`${table}\` SET ? WHERE ${condition}`;
    console.log(`Update query: ${query}`, data, params); // Log para verificar la query
    return new Promise((resolve, reject) => {
        connection.query(query, [data, ...params], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

// Consultas específicas para usuarios y otros datos
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

module.exports = {
    all,
    user,
    newUser,
    delet,
    login,
    update,  // Asegúrate de exportar la función de actualización
    executeQuery,
    endConnection, // Exportamos la función para cerrar la conexión
};
