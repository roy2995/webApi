const request = require('supertest');
const app = require('../src/app'); // Importa tu aplicación de Express

let token;
const user_id = 23;
const bucket_id = 1;

describe('API User Buckets Endpoints', () => {

    beforeAll(async () => {
        // Autenticarse y obtener un token válido
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' });  // Usamos la contraseña correcta

        // Captura el token desde el campo accessToken
        if (res.statusCode === 200) {
            token = res.body.accessToken;  // Acceso al token desde res.body.accessToken
            
            if (!token) {
                console.error('El accessToken no fue devuelto correctamente. Respuesta:', res.body);
            } else {
                console.log('Access token obtenido:', token);
            }
        } else {
            console.error('Error en el login. Código de estado:', res.statusCode, 'Respuesta:', res.body);
        }
    });

    // Test para asignar un bucket a un usuario
    test('Debería asignar un bucket a un usuario', async () => {
        const requestData = { user_id, bucket_id };
        console.log('Request enviado con datos:', requestData);

        const res = await request(app)
            .post('/api/user_buckets')
            .set('Authorization', `Bearer ${token}`) // Incluye el token en la cabecera
            .send(requestData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        console.log('Response body:', res.body);
    });

    // Test para obtener todos los user_buckets
    test('Debería obtener todos los user_buckets', async () => {
        const res = await request(app)
            .get('/api/user_buckets')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.body)).toBe(true);
        console.log('Todos los user_buckets:', res.body.body);
    });

    // Test para obtener los user_buckets por ID de usuario
    test('Debería obtener un user_bucket por ID de usuario', async () => {
        const res = await request(app)
            .get(`/api/user_buckets/${user_id}`)
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toEqual(200);
        
        // Verifica que la respuesta es un array y accede al primer elemento
        const userBucket = res.body.body[0]; // Accede al primer elemento del array
    
        // Verifica que el user_id del primer elemento es el esperado
        expect(userBucket).toHaveProperty('user_id', user_id);
        console.log(`User_bucket para user_id ${user_id}:`, userBucket);
    });
    

    // Test para actualizar el bucket de un usuario
    test('Debería actualizar el bucket de un usuario', async () => {
        const newBucketId = 3;
        console.log('Actualizando bucket para el usuario:', user_id, 'con bucketId:', newBucketId);

        const res = await request(app)
            .put(`/api/user_buckets/${user_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ bucket_id: newBucketId });

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('User_bucket actualizado exitosamente');
        console.log('Update response:', res.body);
    });

    // Test para eliminar un user_bucket
    test('Debería eliminar un user_bucket', async () => {
        const res = await request(app)
            .delete(`/api/user_buckets/${user_id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('User_bucket eliminado exitosamente');
        console.log(`User_bucket con user_id ${user_id} eliminado.`);
    });

    afterAll(async () => {
        console.log('Conexión a la base de datos cerrada.');
    });
});
