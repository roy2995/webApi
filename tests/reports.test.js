const request = require('supertest');
const app = require('../src/app'); // Asegúrate de que esta sea la ruta correcta para tu archivo app.js
const db = require('../src/DB/mysql'); // Conexión a la base de datos

describe('API Reports Endpoints', () => {
    let token;
    let reportId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' }); // Ajusta las credenciales según tu sistema

        token = res.body.accessToken;

        const result = await db.executeQuery(
            `INSERT INTO reports (content, user_id, bucket_id, contingencies_id) VALUES (?, ?, ?, ?)`,
            [JSON.stringify({ dummyData: 'default value', tasks: [{ ID: 6, Type: 2, info: 'Limpiar Superficies' }] }), 2, 3, 1]
        );
        reportId = result.insertId;
    });

    it('Debería crear un nuevo registro en reports', async () => {
        const newReport = {
            content: {
                dummyData: "default value",
                tasks: [
                    { ID: 6, Type: 2, info: "Limpiar Superficies" },
                    { ID: 7, Type: 2, info: "Limpiar Pisos y Pasillos" }
                ],
                contingencies: [
                    { ID: 2, Type: "2", Name: "test" }
                ]
            },
            user_id: 2,
            bucket_id: 3,
            contingencies_id: 1
        };
        const res = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${token}`)
            .send(newReport);

        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        reportId = res.body.body.id;
    });

    it('Debería obtener un registro de reports por ID', async () => {
        const res = await request(app)
            .get(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toHaveProperty('id');
        expect(res.body.body.content).toHaveProperty('tasks');
    });

    it('Debería actualizar un registro existente en reports', async () => {
        const updatedReport = {
            content: {
                dummyData: "updated value",
                tasks: [
                    { ID: 6, Type: 2, info: "Aspirar Alfombras" }
                ]
            },
            user_id: 2,
            bucket_id: 3,
            contingencies_id: 1
        };
        const res = await request(app)
            .put(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedReport);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Informe actualizado exitosamente');
    });

    it('Debería eliminar un registro existente en reports', async () => {
        const res = await request(app)
            .delete(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Informe eliminado exitosamente');
    });

    afterAll(async () => {
        await db.endConnection();
    });
});
