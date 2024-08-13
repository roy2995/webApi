const db = require('../../DB/mysql');

const TABLE = 'users';

function getAll() {
    return db.all(TABLE);
}

async function getUser(id, user_id) {
    let query = `SELECT * FROM ${TABLE} WHERE `;
    let params = [];

    if (id) {
        query += `id = ?`;
        params.push(id);
    } else if (user_id) {
        query += `user_id = ?`;
        params.push(user_id);
    } else {
        throw new Error('Either id or user_id must be provided');
    }

    return db.login(query, params);
}


function createUser(data) {
    return db.newUser(TABLE, data);
}

async function deleteUser(id, user) {
    let condition = '';
    let params = [];

    if (id) {
        condition = 'id = ?';
        params.push(id);
    } else if (user) {
        condition = 'user_id = ?';  
        params.push(user);
    }

    if (condition) {
        return await db.delet(TABLE, condition, params);
    } else {
        throw new Error('ID or username is required to delete');
    }
}

async function loginUser(username, password) {
    const query = `SELECT * FROM users WHERE user_id = ? AND password = ?`;
    const results = await db.login(query, [username, password]);

    if (results.length > 0) {
        return results[0]; 
    } else {
        return null;
    }
}


module.exports = {
    getAll,
    getUser,
    createUser,
    deleteUser,
    loginUser
};