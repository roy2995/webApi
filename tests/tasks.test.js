const request = require('supertest');
const app = require('../src/app'); // Asegúrate de que la ruta a app.js sea correcta
const db = require('../src/DB/mysql'); // Ruta al archivo mysql.js

describe('API Tasks Endpoints', () => {
    let token;
    let taskId; // Variable para almacenar el ID de la tarea creada

    // Antes de todas las pruebas, iniciar sesión y obtener el token
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                username: 'resquivel',
                password: '220506'
            });

        // Verificar que se obtiene el token correctamente
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        token = res.body.accessToken;
    });

    // Test para crear una nueva tarea
    it('Debería crear una nueva tarea', async () => {
        const newTask = {
            name: 'Tarea de prueba',
            info: 'Descripción de prueba'
        };
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(newTask);
        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        taskId = res.body.body.id; // Guardamos el ID de la tarea creada
    });

    // Test para obtener una tarea específica por ID
    it('Debería obtener una tarea específica por ID', async () => {
        const res = await request(app)
            .get(`/api/tasks/${taskId}`) // Usamos el ID de la tarea creada
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.body[0]).toHaveProperty('ID');
        expect(res.body.body[0].ID).toBe(taskId); // Verificamos que el ID es correcto
    });

    // Test para actualizar una tarea existente
    it('Debería actualizar una tarea existente', async () => {
        const updatedTask = {
            name: 'Tarea actualizada',
            info: 'Descripción actualizada'
        };
        const res = await request(app)
            .put(`/api/tasks/${taskId}`) // Usamos el ID de la tarea creada
            .set('Authorization', `Bearer ${token}`)
            .send(updatedTask);
        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Tarea actualizada exitosamente');
    });

    // Test para eliminar una tarea existente
    it('Debería eliminar una tarea existente', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`) // Usamos el ID de la tarea creada
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Tarea eliminada exitosamente');
    });

    // Cerrar la conexión de la base de datos después de todas las pruebas
    afterAll(async () => {
        if (db.connection) {
            await db.connection.end(); // Cierra la conexión al finalizar las pruebas
        }
    });
});
