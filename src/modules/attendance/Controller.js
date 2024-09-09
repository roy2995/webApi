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

// Crear una nueva asistencia
async function createAttendance(data) {
    const query = `INSERT INTO ${TABLE} (user_id, check_in, location, created_at) VALUES (?, ?, ST_GeomFromText(?), NOW())`;
    const values = [data.user_id, data.check_in, `POINT(${data.location.lat} ${data.location.lng})`];
    return db.executeQuery(query, values).then(result => ({ id: result.insertId, ...data }));
}

// Actualizar asistencia
async function updateAttendance(id, data) {
    try {
        let query;
        let values;

        if (data.location && data.location.lat && data.location.lng) {
            // Si se proporcionan las coordenadas, actualiza `check_out` y `location`
            query = `UPDATE ${TABLE} SET check_out = ?, location = ST_GeomFromText(?), created_at = NOW() WHERE id = ?`;
            values = [data.check_out, `POINT(${data.location.lat} ${data.location.lng})`, id];
        } else {
            // Si no se proporcionan las coordenadas, solo actualiza `check_out`
            query = `UPDATE ${TABLE} SET check_out = ?, created_at = NOW() WHERE id = ?`;
            values = [data.check_out, id];
        }

        const result = await db.executeQuery(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar asistencia:', error.message);
        throw error;
    }
}

// Eliminar una asistencia
async function deleteAttendance(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]).then(result => result.affectedRows > 0);
}

async function checkAttendanceToday(userId) {
    const query = `
        SELECT * FROM attendance 
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
