const db = require('../../DB/mysql');
const TABLE = 'Bucket';

// Obtener todos los buckets
async function getAllBuckets() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener un bucket por ID
async function getBucketById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]);
}

// Crear un nuevo bucket
async function createBucket(data) {
    const query = `INSERT INTO ${TABLE} (name) VALUES (?)`;
    return db.executeQuery(query, [data.name]).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar un bucket existente
async function updateBucket(id, data) {
    const query = `UPDATE ${TABLE} SET name = ? WHERE id = ?`;
    return db.executeQuery(query, [data.name, id]).then(result => result.affectedRows > 0);
}

// Eliminar un bucket
async function deleteBucket(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

module.exports = {
    getAllBuckets,
    getBucketById,
    createBucket,
    updateBucket,
    deleteBucket
};