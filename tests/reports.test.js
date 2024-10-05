const request = require('supertest');
const app = require('../src/app'); // Ajusta la ruta de tu archivo app.js
const db = require('../src/DB/mysql'); // Asegúrate de que esta sea la ruta correcta para la conexión a la base de datos

describe('API Reports Endpoints', () => {
    let token;
    let reportId;

    // Obtener un token antes de ejecutar los tests
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' }); // Usa credenciales válidas en tu sistema

        token = res.body.accessToken; // Almacenar el token para usarlo en las solicitudes

        // Insertar un registro de prueba en reports
        const result = await db.executeQuery(`INSERT INTO reports (content, user_id, bucket_id, contingencies_id) VALUES (?, ?, ?, ?)`, 
            [JSON.stringify({ key: 'value' }), 1, 1, 1]);
        reportId = result.insertId; // Guardar el ID del registro insertado
    });

    // Test para crear un nuevo registro en reports
    it('Debería crear un nuevo registro en reports', async () => {
        const newReport = {
            content: { key: 'value' }, // Asegúrate de que este contenido es válido
            user_id: 2,                // Asegúrate de que este user_id exista
            bucket_id: 3,              // Asegúrate de que este bucket_id exista
            contingencies_id: 1        // Asegúrate de que este contingencies_id exista
        };
        const res = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${token}`)
            .send(newReport);

        console.log('Response body:', res.body);  // Ver el contenido completo de la respuesta
        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id'); // Verificar que el ID se está generando dentro de res.body.body
        reportId = res.body.body.id; // Guardar el ID para otros tests
    });

    // Test para obtener un registro de reports por ID
    it('Debería obtener un registro de reports por ID', async () => {
        const res = await request(app)
            .get(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toHaveProperty('id');
        expect(res.body.body.id).toBe(reportId);
    });

    // Test para actualizar un registro de reports
    it('Debería actualizar un registro existente en reports', async () => {
        const updatedReport = {
            content: { key: 'updatedValue' },
            user_id: 1,
            bucket_id: 1,
            contingencies_id: 1
        };
        const res = await request(app)
            .put(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedReport);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Informe actualizado exitosamente'); // Cambia a lo que devuelve tu controlador
    });

    // Test para eliminar un registro de reports
    it('Debería eliminar un registro existente en reports', async () => {
        const res = await request(app)
            .delete(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Informe eliminado exitosamente'); // Cambia a lo que devuelve tu controlador
    });

    // Cerrar la conexión a la base de datos después de los tests
    afterAll(async () => {
        await db.endConnection();
    });
});
