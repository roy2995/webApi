const db = require('../../DB/mysql');
const TABLE = 'reports';

// Función para obtener todos los informes
async function getAllReports() {
    const query = `SELECT * FROM ${TABLE}`;
    return db.executeQuery(query);
}

// Función para obtener un informe por ID
async function getReportById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id]);
}

// Función para crear un nuevo informe
async function createReport(data) {
    const query = `INSERT INTO ${TABLE} (content, user_id, bucket_id, contingencies_id) VALUES (?, ?, ?, ?)`;
    
    const values = [
        JSON.stringify(data.content),  // Cambia data.Reports por data.content
        data.user_id,                  
        data.bucket_id,
        data.contingencies_id
    ];

    const result = await db.executeQuery(query, values);
    
    return {
        id: result.insertId,
        ...data
    };
}

// Función para actualizar un informe existente
async function updateReport(id, data) {
    const query = `UPDATE ${TABLE} SET content = ?, user_id = ?, bucket_id = ?, contingencies_id = ? WHERE id = ?`;
    const values = [JSON.stringify(data.content), data.user_id, data.bucket_id, data.contingencies_id, id];
    return db.executeQuery(query, values)
        .then(result => {
            if (result.affectedRows > 0) {
                console.log(`Informe con ID ${id} actualizado.`);
                return true;
            } else {
                console.warn(`No se encontró informe con ID ${id}.`); 
                return false;
            }
        });
}

// Función para eliminar un informe
async function deleteReport(id) {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    return db.executeQuery(query, [id])
        .then(result => {
            if (result.affectedRows > 0) {
                console.log(`Informe con ID ${id} eliminado.`); 
                return true;
            } else {
                console.warn(`No se encontró informe con ID ${id} para eliminar.`); 
                return false;
            }
        });
}

module.exports = {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport
};
