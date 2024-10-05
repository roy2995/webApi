const request = require('supertest');
const app = require('../src/app'); // Importa tu aplicación de Express

let contingencyId;
let token; // Para almacenar el token JWT

describe('API Contingencies Endpoints', () => {

    // Antes de ejecutar las pruebas protegidas, hacemos login y obtenemos el token JWT
    beforeAll(async () => {
        const loginData = {
            username: 'resquivel',  // Asegúrate de tener este usuario en la base de datos
            password: '220506'      // Contraseña correcta
        };

        const res = await request(app)
            .post('/api/users/login')
            .send(loginData);

        expect(res.statusCode).toEqual(200);
        token = res.body.accessToken;  // Guardamos el token JWT
        console.log('Token JWT obtenido:', token);
    });

    // Prueba para obtener todas las contingencias (sin autenticación)
    test('Debería obtener todas las contingencias (sin autenticación)', async () => {
        const res = await request(app)
            .get('/api/contingencies');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.body)).toBe(true);

        console.log('Todas las contingencias:', res.body.body);
    });

    // Prueba para crear una nueva contingencia (requiere autenticación)
    test('Debería crear una nueva contingencia (requiere autenticación)', async () => {
        const requestData = { name: 'Test Contingency' };

        const res = await request(app)
            .post('/api/contingencies')
            .set('Authorization', `Bearer ${token}`)  // Usamos el token para autenticarnos
            .send(requestData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.body).toHaveProperty('id');
        expect(res.body.body).toHaveProperty('name', requestData.name);

        // Guardamos el ID para usarlo en otros tests
        contingencyId = res.body.body.id;

        console.log('Nueva contingencia creada con ID:', contingencyId);
    });

    // Prueba para obtener una contingencia por ID (sin autenticación)
    test('Debería obtener una contingencia por ID (sin autenticación)', async () => {
        const res = await request(app)
            .get(`/api/contingencies/${contingencyId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toHaveProperty('ID', contingencyId);
        expect(res.body.body).toHaveProperty('name', 'Test Contingency');

        console.log(`Contingencia obtenida por ID (${contingencyId}):`, res.body.body);
    });

    // Prueba para actualizar una contingencia por ID (requiere autenticación)
    test('Debería actualizar una contingencia por ID (requiere autenticación)', async () => {
        const updatedData = { name: 'Updated Contingency' };

        const res = await request(app)
            .put(`/api/contingencies/${contingencyId}`)
            .set('Authorization', `Bearer ${token}`)  // Usamos el token para autenticarnos
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Contingencia actualizada exitosamente');

        console.log('Contingencia actualizada con ID:', contingencyId);
    });

    // Prueba para eliminar una contingencia por ID (requiere autenticación)
    test('Debería eliminar una contingencia por ID (requiere autenticación)', async () => {
        const res = await request(app)
            .delete(`/api/contingencies/${contingencyId}`)
            .set('Authorization', `Bearer ${token}`);  // Usamos el token para autenticarnos

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Contingencia eliminada exitosamente');

        console.log('Contingencia eliminada con ID:', contingencyId);
    });

});
