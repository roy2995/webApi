const request = require('supertest');
const app = require('../src/app');
const db = require('../src/DB/mysql');

describe('API User Buckets Endpoints', () => {
    let token;
    let userId = 2;  // Usaremos user_id 2 directamente
    let bucketId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' });

        token = res.body.accessToken;
        console.log('Access token obtenido:', token);
    });

    it('Debería asignar un bucket a un usuario', async () => {
        const newBucket = { user_id: userId, bucket_id: 2 };  // Asignando bucket_id: 2
        console.log('Request enviado con datos:', newBucket);

        const res = await request(app)
            .post('/api/user_buckets')
            .set('Authorization', `Bearer ${token}`)
            .send(newBucket);

        console.log('Response body:', res.body);

        // Verificar que el estado sea 201
        expect(res.statusCode).toEqual(201);
        // Verificar que el cuerpo contenga los atributos user_id y bucket_id
        expect(res.body.body).toHaveProperty('user_id');
        expect(res.body.body).toHaveProperty('bucket_id');

        // Guardar bucket_id para los siguientes tests
        bucketId = res.body.body.bucket_id;
    });

    it('Debería actualizar el bucket de un usuario', async () => {
        // Verificación para asegurar que bucketId no sea undefined
        if (!bucketId) {
            throw new Error('bucketId no está definido. Verifica el test anterior.');
        }

        const updatedBucket = { bucket_id: 3 };

        const res = await request(app)
            .put(`/api/user_buckets/${bucketId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBucket);

        console.log('Update response:', res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Bucket actualizado exitosamente');
    });

    it('Debería eliminar un bucket de un usuario', async () => {
        // Verificación para asegurar que bucketId no sea undefined
        if (!bucketId) {
            throw new Error('bucketId no está definido. Verifica el test anterior.');
        }

        const res = await request(app)
            .delete(`/api/user_buckets/${bucketId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Delete response:', res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Bucket eliminado exitosamente');
    });

    afterAll(async () => {
        await db.endConnection();
        console.log('Conexión a la base de datos cerrada.');
    });
});
