const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TABLE = 'users';

//all Users
function getAllUsers() {
    return db.all(TABLE);
}

//user by Id
function getUserById(id) {
    return db.user(TABLE, id);
}

//new user 
async function createUser(data) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    return db.newUser(TABLE, data);
}

//Update data user
async function updateUser(id, data) {
    if (data.password) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);
    }
    return db.update(TABLE, data, 'id = ?', [id]);
}

//delete user
async function deleteUser(id) {
    return db.delet(TABLE, 'id = ?', [id]);
}

//login function
async function loginUser(username, password) {
    const query = `SELECT * FROM \`${TABLE}\` WHERE username = ?`;
    const results = await db.login(query, [username]);

    if (results.length > 0) {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const accessToken = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            const refreshToken = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.REFRESH_TOKEN_SECRET
            );

            return {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                accessToken,
                refreshToken
            };
        }
    }

    return null;
}

async function refreshAccessToken(refreshToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return reject('Invalid refresh token');
            
            const newAccessToken = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            resolve(newAccessToken);
        });
    });
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    refreshAccessToken
};
