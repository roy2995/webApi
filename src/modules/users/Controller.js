const db = require('../../DB/mysql');

const TABLE = 'Users'

function getAll(){
    return db.all(TABLE);
}

module.exports = {
    getAll,
}