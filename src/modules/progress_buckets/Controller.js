const db = require('../../DB/mysql');
const TABLE = 'progress_buckets';

// Obtener todos los progresos de buckets
async function getAllProgressBuckets() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener el progreso de un bucket por su ID
async function getProgressBucketById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]);
}

// Crear un nuevo progreso para un bucket
async function createProgressBucket(data) {
    const query = `INSERT INTO ${TABLE} (bucket_id, status, user_id, date) VALUES (?, ?, ?, ?)`;
    const values = [data.bucket_id, data.status, data.user_id, data.date];
    return db.executeQuery(query, values)
        .then(result => ({ id: result.insertId, ...data })) 
        .catch(error => { 
            console.error('Error en la creación del progreso de bucket:', error); 
            throw error; 
        });
}

// Actualizar el progreso de un bucket existente
async function updateProgressBucket(id, data) {
    const query = `UPDATE ${TABLE} SET bucket_id = ?, status = ?, user_id = ?, date = ? WHERE id = ?`;
    const values = [data.bucket_id, data.status, data.user_id, data.date, id];
    return db.executeQuery(query, values).then(result => result.affectedRows > 0);
}

// Eliminar el progreso de un bucket
async function deleteProgressBucket(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

module.exports = {
    getAllProgressBuckets,
    getProgressBucketById,
    createProgressBucket,
    updateProgressBucket,
    deleteProgressBucket
};
