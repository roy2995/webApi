const db = require('../../DB/mysql');

// Asignar un bucket a un usuario
async function assignBucketToUser(data) {
    console.log('Assigning bucket to user:', data); // Log para verificar el data antes de la inserción

    const result = await db.executeQuery('INSERT INTO user_buckets SET ?', data);

    console.log('Insert result:', result); // Verificar el resultado de la inserción

    return {
        id: result.insertId,
        user_id: data.user_id,
        bucket_id: data.bucket_id
    };
}

// Actualizar un bucket asignado a un usuario
async function updateUserBucket(userId, bucketId) {
    const query = 'UPDATE user_buckets SET bucket_id = ? WHERE user_id = ?';
    const result = await db.executeQuery(query, [bucketId, userId]);

    console.log('Update result:', result); // Verificar el resultado de la actualización

    return result.affectedRows > 0;
}

// Eliminar un bucket asignado a un usuario
async function deleteUserBucket(bucketId) {
    const query = 'DELETE FROM user_buckets WHERE bucket_id = ?';
    const result = await db.executeQuery(query, [bucketId]);

    console.log('Delete result:', result); // Verificar el resultado de la eliminación

    return result.affectedRows > 0;
}

module.exports = {
    assignBucketToUser,
    updateUserBucket,
    deleteUserBucket
};
