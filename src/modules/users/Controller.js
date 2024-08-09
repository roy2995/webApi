const db = require('../../DB/mysql');

const TABLE = 'Users';

function getAll() {
    return db.all(TABLE);
}

function getUser(id) {
    return db.user(TABLE, id);
}

function createUser(data) {
    return db.newUser(TABLE, data);
}

function deleteUser(id) {
    return db.delet(TABLE, id);
}

module.exports = {
    getAll,
    getUser
};
