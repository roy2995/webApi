const db = require('../../DB/mysql');
const TABLE = 'progress_task';

// Obtener todos los progresos de tareas
async function getAllProgressTasks() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener el progreso de una tarea por su ID
async function getProgressTaskById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]);
}

// Crear un nuevo progreso para una tarea
async function createProgressTask(data) {
    const query = `INSERT INTO ${TABLE} (task_id, status, user_id, date) VALUES (?, ?, ?, ?)`;
    const values = [data.task_id, data.status, data.user_id, data.date];
    return db.executeQuery(query, values).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar el progreso de una tarea existente
async function updateProgressTask(id, data) {
    const query = `UPDATE ${TABLE} SET task_id = ?, status = ?, user_id = ?, date = ? WHERE id = ?`;
    const values = [data.task_id, data.status, data.user_id, data.date, id];
    return db.executeQuery(query, values).then(result => result.affectedRows > 0);
}

// Eliminar el progreso de una tarea
async function deleteProgressTask(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

module.exports = {
    getAllProgressTasks,
    getProgressTaskById,
    createProgressTask,
    updateProgressTask,
    deleteProgressTask
};
