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
    const results = await db.login(query, [username]);

    if (results.length > 0) {
        const user = results[0];

        // Comparar la contraseña ingresada con la contraseña cifrada
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Generar un token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.ACCESS_TOKEN_SECRET, // Asegúrate de tener esta variable en tu archivo .env
                { expiresIn: '1h' } // El token expirará en 1 hora
            );

            // Retornar el usuario junto con el token
            return { user, token };
        }
    }

    // Retornar null si no coinciden o no se encuentra el usuario
    return null;
}



module.exports = {
    getAll,
    getUser,
    createUser,
    deleteUser,
    loginUser
};