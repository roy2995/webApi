const db = require('../../DB/mysql');

// Crear una nueva contingencia
async function createContingency(data) {
    console.log('Creando nueva contingencia:', data);
    const query = 'INSERT INTO contingencies SET ?';
    const result = await db.executeQuery(query, data);
    return {
        id: result.insertId,
        name: data.name
    };
}

// Obtener todas las contingencias
async function getAllContingencies() {
    const query = 'SELECT * FROM contingencies';
    return db.executeQuery(query);
}

// Obtener una contingencia por ID
async function getContingencyById(id) {
    const query = 'SELECT * FROM contingencies WHERE id = ?';
    const results = await db.executeQuery(query, [id]);
    if (results.length > 0) {
        return results[0];
    } else {
        throw new Error(`No se encontró la contingencia con ID ${id}`);
    }
}

// Actualizar una contingencia por ID
async function updateContingency(id, name) {
    console.log('Actualizando contingencia con ID:', id);
    const query = 'UPDATE contingencies SET name = ? WHERE id = ?';
    const result = await db.executeQuery(query, [name, id]);

    if (result.affectedRows > 0) {
        return true; 
    } else {
        throw new Error(`No se encontró la contingencia con ID ${id}`);
    }
}

// Eliminar una contingencia por ID
async function deleteContingency(id) {
    const query = 'DELETE FROM contingencies WHERE id = ?';
    const result = await db.executeQuery(query, [id]);

    if (result.affectedRows > 0) {
        return true;
    } else {
        throw new Error(`No se encontró la contingencia con ID ${id}`);
    }
}

module.exports = {
    createContingency,
    getAllContingencies,
    getContingencyById,
    updateContingency,
    deleteContingency
};
