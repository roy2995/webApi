const request = require('supertest');
const app = require('../src/app'); // Ajusta la ruta de tu archivo app.js
const db = require('../src/DB/mysql'); // Asegúrate de que esta sea la ruta correcta para la conexión a la base de datos

describe('API Progress Buckets Endpoints', () => {
    let token;
    let progressBucketId;

    // Obtener un token antes de ejecutar los tests
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' }); // Usa credenciales válidas en tu sistema

        token = res.body.accessToken; // Almacenar el token para usarlo en las solicitudes
    });

    // Test para crear un nuevo progreso de bucket
    it('Debería crear un nuevo progreso de bucket', async () => {
        const newProgressBucket = {
            bucket_id: 1,  // Asegúrate de que este bucket_id exista en tu base de datos
            status: 'in progress',
            user_id: 1,    // Asegúrate de que este user_id exista
            date: '2024-10-05'
        };
        const res = await request(app)
            .post('/api/progress_buckets')
            .set('Authorization', `Bearer ${token}`)
            .send(newProgressBucket);
    
        expect(res.statusCode).toEqual(201);
        console.log('Response body:', res.body);  // Agregar esta línea para ver el contenido completo de la respuesta
        expect(res.body.body).toHaveProperty('id');  // Verificar que el ID se está generando
        progressBucketId = res.body.body.id; // Guardar el ID para otros tests
    });

    // Test para obtener un progreso de bucket por ID
    it('Debería obtener un progreso de bucket por ID', async () => {
        const res = await request(app)
            .get(`/api/progress_buckets/${progressBucketId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body[0]).toHaveProperty('id');
        expect(res.body.body[0].id).toBe(progressBucketId);
    });

    // Test para actualizar un progreso de bucket
    it('Debería actualizar un progreso de bucket existente', async () => {
        const updatedProgressBucket = {
            bucket_id: 1,
            status: 'completed',
            user_id: 1,
            date: '2024-10-06'
        };
        const res = await request(app)
            .put(`/api/progress_buckets/${progressBucketId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedProgressBucket);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Progreso del bucket actualizado exitosamente');
    });

    // Test para eliminar un progreso de bucket
    it('Debería eliminar un progreso de bucket existente', async () => {
        const res = await request(app)
            .delete(`/api/progress_buckets/${progressBucketId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Progreso del bucket eliminado exitosamente');
    });

    // Cerrar la conexión a la base de datos después de los tests
    afterAll(async () => {
        await db.endConnection();
    });
});
