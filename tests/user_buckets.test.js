const request = require('supertest');
const app = require('../src/app');
const db = require('../src/DB/mysql');

describe('API User Buckets Endpoints', () => {
    let token;
    let userId = 2; 
    let bucketId = 1; 

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' });

        token = res.body.accessToken;
        console.log('Access token obtenido:', token);
    });

    it('Debería asignar un bucket a un usuario', async () => {
        const newBucket = { user_id: userId, bucket_id: bucketId };
        console.log('Request enviado con datos:', newBucket);
        
        try {
            const res = await request(app)
                .post('/api/user_buckets')
                .set('Authorization', `Bearer ${token}`)
                .send(newBucket);

            console.log('Response body:', res.body);

            if (res.statusCode !== 201) {
                console.error('Error al asignar bucket al usuario:', res.body);
            }

            expect(res.statusCode).toEqual(201);
            expect(res.body.body).toHaveProperty('user_id');
            expect(res.body.body).toHaveProperty('bucket_id');

            userId = res.body.body.user_id;
            bucketId = res.body.body.bucket_id;

        } catch (error) {
            console.error('Error en la solicitud de asignación de bucket:', error);
        }
    });

    it('Debería actualizar el bucket de un usuario', async () => {
        if (!userId) {
            throw new Error('userId no está definido. Verifica el test anterior.');
        }

        const updatedBucket = { bucket_id: 3 };

        try {
            const res = await request(app)
                .put(`/api/user_buckets/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBucket);

            console.log('Update response:', res.body);

            expect(res.statusCode).toEqual(200);
            expect(res.body.body).toEqual('Bucket actualizado exitosamente');
        } catch (error) {
            console.error('Error en la solicitud de actualización de bucket:', error);
        }
    });

    it('Debería eliminar un bucket de un usuario', async () => {
        if (!bucketId) {
            throw new Error('bucketId no está definido. Verifica el test anterior.');
        }

        try {
            const res = await request(app)
                .delete(`/api/user_buckets/${bucketId}`)
                .set('Authorization', `Bearer ${token}`);

            console.log('Delete response:', res.body);

            expect(res.statusCode).toEqual(200);
            expect(res.body.body).toEqual('Bucket eliminado exitosamente');
        } catch (error) {
            console.error('Error en la solicitud de eliminación de bucket:', error);
        }
    });

    afterAll(async () => {
        await db.endConnection();
        console.log('Conexión a la base de datos cerrada.');
    });
});
