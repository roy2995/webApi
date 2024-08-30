const jwt = require('jsonwebtoken');

const user = {
    id: 220506,              // ID del Usuario
    username: 'resquivel',   // Nombre de Usuario
    role: 'admin'            // Rol del Usuario
};

const secretKey = '076d458b9f3d34231e2977af967ed9e958b03a3228dfe43e89e4603f18d036d9'; // Clave secreta
const token = jwt.sign(user, secretKey); // No se especifica expiresIn

console.log(token);
