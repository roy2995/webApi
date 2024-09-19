const db = require('../../DB/mysql');
const TABLE_USER_GROUPS = 'user_groups';

// Mover un usuario a otro grupo (modificar bukets_id)
async function moveUserToAnotherGroup(userId, newBuketsId) {
    const query = `UPDATE ${TABLE_USER_GROUPS} SET bukets_id = ? WHERE user_id = ?`;
    return db.executeQuery(query, [newBuketsId, userId]);
}

// Obtener todos los usuarios que tienen un bukets_id
async function getUsersWithBuketsId() {
    const query = `SELECT * FROM ${TABLE_USER_GROUPS} WHERE bukets_id IS NOT NULL`;
    return db.executeQuery(query);
}

module.exports = {
    moveUserToAnotherGroup,
    getUsersWithBuketsId
};
