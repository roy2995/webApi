const db = require('../../DB/mysql');

const TABLE = 'bukets_groups';

function getAll() {
    return db.all(TABLE); 
}

function updateBukets(username, newBuketsId) {
    return db.updateBuketsGroup('bukets_groups', username, newBuketsId);
}



module.exports = {
    getAll,
    updateBukets
};