const request = require('supertest');
const app = require('../src/app');
const db = require('../src/DB/mysql');

describe('API Buckets Endpoints', () => {
    let token;
    let bucketId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' });

        token = res.body.accessToken;
    });

    it('Debería crear un nuevo bucket', async () => {
        const newBucket = { Tipo: 'Tipo de prueba', Area: 'Area de prueba', Terminal: 'Terminal de prueba', Nivel: 'Nivel de prueba' };
        const res = await request(app)
            .post('/api/buckets')
            .set('Authorization', `Bearer ${token}`)
            .send(newBucket);

        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        bucketId = res.body.body.id; // Guardamos el ID del bucket creado
    });

    it('Debería obtener un bucket específico por ID', async () => {
        const res = await request(app)
            .get(`/api/buckets/${bucketId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.body[0]).toHaveProperty('ID');
        expect(res.body.body[0].ID).toBe(bucketId); // Verificamos que el ID es correcto
    });

    it('Debería actualizar un bucket existente', async () => {
        const updatedBucket = { Tipo: 'Tipo actualizado', Area: 'Area actualizada', Terminal: 'Terminal actualizada', Nivel: 'Nivel actualizado' };
        const res = await request(app)
            .put(`/api/buckets/${bucketId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBucket);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Bucket actualizado exitosamente');
    });

    it('Debería eliminar un bucket existente', async () => {
        const res = await request(app)
            .delete(`/api/buckets/${bucketId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Bucket eliminado exitosamente');
    });

    afterAll(async () => {
        await db.endConnection();
    });
});
