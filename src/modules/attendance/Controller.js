const db = require('../../DB/mysql');
const TABLE = 'attendance';

// Obtener todas las asistencias
async function getAll() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Obtener asistencia por ID
async function getAttendance(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]);
}

// Crear una nueva asistencia (check-in)
async function createAttendance(data) {
    const query = `INSERT INTO ${TABLE} (user_id, check_in, location, created_at) VALUES (?, ?, ST_GeomFromText(?), NOW())`;
    const values = [data.user_id, data.check_in, `POINT(${data.location.lat} ${data.location.lng})`];
    return db.executeQuery(query, values).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar asistencia (check-out con fecha y hora)
async function updateAttendance(id, data) {
    const query = `UPDATE ${TABLE} SET check_out = ?, created_at = NOW() WHERE id = ?`;
    const values = [data.check_out, id];

    const result = await db.executeQuery(query, values);
    return result.affectedRows > 0;
}

// Eliminar una asistencia
async function deleteAttendance(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

// Verificar si el usuario ya hizo check-in hoy
async function checkAttendanceToday(userId) {
    const query = `
        SELECT * FROM ${TABLE} 
        WHERE user_id = ? AND DATE(check_in) = CURDATE()`;
    
    const result = await db.executeQuery(query, [userId]);
    return result.length > 0;  // Si tiene registros, devuelve true
}

module.exports = {
    getAll,
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    checkAttendanceToday
};
