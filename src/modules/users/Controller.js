const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const TABLE = 'users';

function getAll() {
    return db.all(TABLE);
}

function getUser(id) {
    return db.user(TABLE, id);
}

async function createUser(data) {
    const saltRounds = 10;
}

async function deleteUser(id, user) {
    let condition = '';
    let params = [];

    if (id) {
        condition = 'id = ?';
        params.push(id);
    } else if (user) {
        condition = 'User = ?';
        params.push(user);
    }

    if (condition) {
        return await db.delet(TABLE, condition, params);
    } else {
        throw new Error('ID or username is required to delete');
    }
}

async function loginUser(username, password) {
    const query = `SELECT * FROM \`${TABLE}\` WHERE username = ? AND password = ?`;
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