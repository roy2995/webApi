const request = require('supertest');
const app = require('../src/app'); // Ajusta la ruta según tu estructura de proyecto
const db = require('../src/DB/mysql'); // Asegúrate de que la ruta sea correcta

describe('API Progress Contingencies Endpoints', () => {
    let token;
    let progressContingencyId;

    // Obtener el token antes de ejecutar los tests
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' }); // Usa credenciales válidas en tu sistema

        token = res.body.accessToken; // Almacenar el token para futuras solicitudes
    });

    // Test para crear un nuevo progreso de contingencia
    it('Debería crear un nuevo progreso de contingencia', async () => {
        const newProgressContingency = {
            contingency_id: 1,
            status: 'in progress',
            user_id: 1,
            date: '2024-10-05'
        };
        const res = await request(app)
            .post('/api/progress_contingencies')
            .set('Authorization', `Bearer ${token}`)
            .send(newProgressContingency);

        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        progressContingencyId = res.body.body.id; // Guardar el ID para futuros tests
    });

    // Test para obtener un progreso de contingencia por ID
    it('Debería obtener un progreso de contingencia por ID', async () => {
        const res = await request(app)
            .get(`/api/progress_contingencies/${progressContingencyId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body[0]).toHaveProperty('id');
        expect(res.body.body[0].id).toBe(progressContingencyId); 
    });

    // Test para actualizar un progreso de contingencia
    it('Debería actualizar un progreso de contingencia existente', async () => {
        const updatedProgressContingency = {
            contingency_id: 1,
            status: 'completed',
            user_id: 1,
            date: '2024-10-06'
        };
        const res = await request(app)
            .put(`/api/progress_contingencies/${progressContingencyId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedProgressContingency);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Progreso de la contingencia actualizado exitosamente');
    });

    // Test para eliminar un progreso de contingencia
    it('Debería eliminar un progreso de contingencia existente', async () => {
        const res = await request(app)
            .delete(`/api/progress_contingencies/${progressContingencyId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Progreso de la contingencia eliminado exitosamente');
    });

    // Cerrar la conexión a la base de datos después de todos los tests
    afterAll(async () => {
        await db.endConnection();
    });
});
