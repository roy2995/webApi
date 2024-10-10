const db = require('../../DB/mysql');
const TABLE = 'progress_contingencies';

// Obtener todos los progresos de contingencias
async function getAllProgressContingencies() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener el progreso de una contingencia por ID
async function getProgressContingencyById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]);
}

// Crear un nuevo progreso para una contingencia
async function createProgressContingency(data) {
    const query = `INSERT INTO ${TABLE} (contingency_id, status, user_id, date) VALUES (?, ?, ?, ?)`;
    const values = [data.contingency_id, data.status, data.user_id, data.date];
    return db.executeQuery(query, values).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar un progreso de contingencia existente
async function updateProgressContingency(id, data) {
    const query = `UPDATE ${TABLE} SET contingency_id = ?, status = ?, user_id = ?, date = ? WHERE id = ?`;
    const values = [data.contingency_id, data.status, data.user_id, data.date, id];
    return db.executeQuery(query, values).then(result => result.affectedRows > 0);
}

// Eliminar un progreso de contingencia
async function deleteProgressContingency(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

module.exports = {
    getAllProgressContingencies,
    getProgressContingencyById,
    createProgressContingency,
    updateProgressContingency,
    deleteProgressContingency
};
