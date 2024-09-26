const db = require('../../DB/mysql');
const TABLE = 'task_buckets';

// Obtener todas las relaciones entre tareas y buckets
async function getAllTaskBuckets() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener las relaciones de una tarea específica con buckets
async function getTaskBucketsByTaskId(task_id) {
    const query = `SELECT * FROM ${TABLE} WHERE task_id = ?`;
    return db.executeQuery(query, [task_id]);
}

// Crear una nueva relación entre tarea y bucket
async function createTaskBucket(data) {
    const query = `INSERT INTO ${TABLE} (task_id, bucket_id, contingencie_id) VALUES (?, ?, ?)`;
    const values = [data.task_id, data.bucket_id, data.contingencie_id];
    return db.executeQuery(query, values).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar la relación entre una tarea y un bucket
async function updateTaskBucket(id, data) {
    const query = `UPDATE ${TABLE} SET task_id = ?, bucket_id = ?, contingencie_id = ? WHERE id = ?`;
    const values = [data.task_id, data.bucket_id, data.contingencie_id, id];
    return db.executeQuery(query, values).then(result => result.affectedRows > 0);
}

// Eliminar una relación entre tarea y bucket
async function deleteTaskBucket(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

module.exports = {
    getAllTaskBuckets,
    getTaskBucketsByTaskId,
    createTaskBucket,
    updateTaskBucket,
    deleteTaskBucket
};
