const db = require('../../DB/mysql');
const TABLE = 'task';

// Obtener todas las tareas
async function getAllTasks() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener una tarea por ID
async function getTaskById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]);
}

// Crear una nueva tarea
async function createTask(data) {
    const query = `INSERT INTO ${TABLE} (name, info) VALUES (?, ?)`;
    const values = [data.name, data.info];
    return db.executeQuery(query, values).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar una tarea existente
async function updateTask(id, data) {
    const query = `UPDATE ${TABLE} SET name = ?, info = ? WHERE id = ?`;
    const values = [data.name, data.info, id];
    return db.executeQuery(query, values).then(result => result.affectedRows > 0);
}

// Eliminar una tarea
async function deleteTask(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
