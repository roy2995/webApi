const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TABLE = 'users';

function getAll() {
    return db.all(TABLE);
}

function getUser(id) {
    return db.user(TABLE, id);
}

async function createUser(data) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    return db.newUser(TABLE, data);
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
    const query = `SELECT * FROM \`${TABLE}\` WHERE username = ?`;
    console.log('Running query:', query);

    const results = await db.login(query, [username]);

    if (results.length > 0) {
        const user = results[0];
        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (isMatch) {
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            console.log('Generated token:', token);

            return { user, token };
        }
    }

    console.log('Invalid credentials');
    return null;
}




module.exports = {
    getAll,
    getUser,
    createUser,
    deleteUser,
    loginUser
};