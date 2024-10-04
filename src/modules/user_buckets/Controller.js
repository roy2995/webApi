const db = require('../../DB/mysql');

// Asignar un bucket a un usuario (con manejo de error si user_id ya existe)
async function assignBucketToUser(data) {
    console.log('Asignando bucket a usuario:', data);
    const query = 'INSERT INTO user_buckets SET ?';
    try {
        const result = await db.executeQuery(query, data);
        return {
            id: result.insertId,
            user_id: data.user_id,
            bucket_id: data.bucket_id
        };
    } catch (error) {
        // Si el user_id ya existe (clave única), capturamos el error
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error(`El user_id ${data.user_id} ya tiene un bucket asignado.`);
        }
        throw error;
    }
}

// Obtener todos los user_buckets
async function getAllUserBuckets() {
    const query = 'SELECT * FROM user_buckets';
    return db.executeQuery(query);
}

// Obtener buckets por ID de usuario
async function getBucketsByUserId(userId) {
    const query = 'SELECT * FROM user_buckets WHERE user_id = ?';
    return db.executeQuery(query, [userId]);
}

// Actualizar un bucket asignado a un usuario (usando user_id único)
async function updateUserBucket(userId, bucketId) {
    console.log('Actualizando bucket para el usuario:', userId, 'con bucketId:', bucketId);

    // Consulta SQL para actualizar basado en user_id único
    const query = 'UPDATE user_buckets SET bucket_id = ? WHERE user_id = ?';
    const result = await db.executeQuery(query, [bucketId, userId]);

    console.log('Resultado de la actualización:', result);
    
    if (result.affectedRows > 0) {
        return true; // La actualización fue exitosa
    } else {
        throw new Error(`No se encontró el user_bucket para el user_id ${userId}`);
    }
}

// Eliminar un bucket asignado a un usuario (usando user_id)
async function deleteUserBucket(userId) {
    const query = 'DELETE FROM user_buckets WHERE user_id = ?'; // Eliminar basado en user_id
    const result = await db.executeQuery(query, [userId]);

    if (result.affectedRows > 0) {
        return true; // Eliminación exitosa
    } else {
        throw new Error(`No se encontró el user_bucket para el user_id ${userId}`);
    }
}

module.exports = {
    assignBucketToUser,
    getAllUserBuckets,
    getBucketsByUserId,
    updateUserBucket,
    deleteUserBucket
};
