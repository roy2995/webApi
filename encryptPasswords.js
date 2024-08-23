// encryptPasswords.js
const bcrypt = require('bcrypt');
const db = require('./src/DB/mysql'); // Ajusta la ruta según la estructura de tu proyecto

async function encryptExistingPasswords() {
    try {
        const users = await db.all('users'); // Reemplaza 'all' con la función que obtenga todos los usuarios
        const saltRounds = 10;

        for (const user of users) {
            if (!user.password.startsWith('$2b$')) { // Verifica si la contraseña ya está cifrada
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                
                // Actualiza la contraseña en la base de datos
                await db.updatePassword(user.id, hashedPassword);
            }
        }

        console.log('Todas las contraseñas han sido cifradas correctamente.');
    } catch (err) {
        console.error('Error al cifrar las contraseñas:', err);
    }
}

encryptExistingPasswords();
