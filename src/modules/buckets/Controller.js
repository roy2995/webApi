const db = require('../../DB/mysql');
const TABLE = 'bucket';  // Nombre correcto de la tabla

// Obtener todos los buckets
async function getAllBuckets() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener un bucket por ID
async function getBucketById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE ID = ?`;  // Cambiado a 'ID'
    return db.executeQuery(query, [id]);
}

// Crear un nuevo bucket
async function createBucket(data) {
    const query = `INSERT INTO ${TABLE} (Tipo, Area, Terminal, Nivel) VALUES (?, ?, ?, ?)`;  // Campos correctos
    const values = [data.Tipo, data.Area, data.Terminal, data.Nivel];
    return db.executeQuery(query, values).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar un bucket existente
async function updateBucket(id, data) {
    const query = `UPDATE ${TABLE} SET Tipo = ?, Area = ?, Terminal = ?, Nivel = ? WHERE ID = ?`;  // Usar campos correctos
    const values = [data.Tipo, data.Area, data.Terminal, data.Nivel, id];
    return db.executeQuery(query, values).then(result => result.affectedRows > 0);
}

// Eliminar un bucket
async function deleteBucket(id) {
    const query = `DELETE FROM ${TABLE} WHERE ID = ?`;  // Cambiado a 'ID'
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

module.exports = {
    getAllBuckets,
    getBucketById,
    createBucket,
    updateBucket,
    deleteBucket
};
