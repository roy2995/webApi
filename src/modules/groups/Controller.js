const db = require('../../DB/mysql');
const TABLE_GROUPS = '`grupos`';

// Obtener todos los grupos (solo admin)
async function getAllGroups() {
    try {
        const query = `SELECT * FROM ${TABLE_GROUPS}`;
        const groups = await db.executeQuery(query); 
        if (!groups) {
            return { error: true, message: 'No se encontraron grupos' };
        }
        return groups;
    } catch (error) {
        console.error('Error al obtener los grupos:', error.message);
        throw new Error('Error al obtener los grupos');
    }
}

// Obtener un grupo por ID
async function getGroupById(id) {
    try {
        const query = `SELECT * FROM ${TABLE_GROUPS} WHERE id = ?`;
        const group = await db.executeQuery(query, [id]);
        if (!group || group.length === 0) {
            return { error: true, message: 'No se encontró el grupo' };
        }
        return group[0]; // As we are fetching by ID, return the first entry.
    } catch (error) {
        console.error('Error al obtener el grupo por ID:', error.message);
        throw new Error('Error al obtener el grupo por ID');
    }
}

module.exports = {
    getAllGroups,
    getGroupById
};