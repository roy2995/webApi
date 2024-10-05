const request = require('supertest');
const app = require('../src/app'); // Ajusta la ruta según tu estructura de proyecto
const db = require('../src/DB/mysql'); // Asegúrate de que la ruta sea correcta

describe('API Progress Tasks Endpoints', () => {
    let token;
    let progressTaskId;

    // Obtener el token antes de ejecutar los tests
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' }); // Usa credenciales válidas en tu sistema

        token = res.body.accessToken; // Almacenar el token para futuras solicitudes
    });

    // Test para crear un nuevo progreso de tarea
    it('Debería crear un nuevo progreso de tarea', async () => {
        const newProgressTask = {
            task_id: 1,
            status: 'in progress',
            user_id: 1,
            date: '2024-10-05'
        };
        const res = await request(app)
            .post('/api/progress_tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(newProgressTask);

        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        progressTaskId = res.body.body.id; // Guardar el ID para futuros tests
    });

    // Test para obtener un progreso de tarea por ID
    it('Debería obtener un progreso de tarea por ID', async () => {
        const res = await request(app)
            .get(`/api/progress_tasks/${progressTaskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body[0]).toHaveProperty('id');
        expect(res.body.body[0].id).toBe(progressTaskId); 
    });

    // Test para actualizar un progreso de tarea
    it('Debería actualizar un progreso de tarea existente', async () => {
        const updatedProgressTask = {
            task_id: 1,
            status: 'completed',
            user_id: 1,
            date: '2024-10-06'
        };
        const res = await request(app)
            .put(`/api/progress_tasks/${progressTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedProgressTask);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Progreso de tarea actualizado exitosamente');
    });

    // Test para eliminar un progreso de tarea
    it('Debería eliminar un progreso de tarea existente', async () => {
        const res = await request(app)
            .delete(`/api/progress_tasks/${progressTaskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Progreso de tarea eliminado exitosamente');
    });

    // Cerrar la conexión a la base de datos después de todos los tests
    afterAll(async () => {
        await db.endConnection();
    });
});
