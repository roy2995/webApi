const request = require('supertest');
const app = require('../src/app');
const db = require('../src/DB/mysql');

describe('API Tasks Endpoints', () => {
    let token;
    let taskId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' });

        token = res.body.accessToken;
    });

    it('Debería crear una nueva tarea', async () => {
        const newTask = { Type: 'Tarea de prueba', info: 'Descripción de prueba' };
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(newTask);

        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        taskId = res.body.body.id;
    });

    it('Debería obtener una tarea específica por ID', async () => {
        const res = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.body[0]).toHaveProperty('ID');
        expect(res.body.body[0].ID).toBe(taskId); 
    });    

    it('Debería actualizar una tarea existente', async () => {
        const updatedTask = { Type: 'Tarea actualizada', info: 'Descripción actualizada' };
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedTask);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Tarea actualizada exitosamente');
    });

    it('Debería eliminar una tarea existente', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Tarea eliminada exitosamente');
    });

    afterAll(async () => {
        await db.endConnection();
    });
});
