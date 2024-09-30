const request = require('supertest');
const app = require('../src/app');
const db = require('../src/DB/mysql');

describe('API Attendance Endpoints', () => {
    let token;
    let attendanceId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'resquivel', password: '220506' });

        token = res.body.accessToken;
    });

    it('Debería crear una nueva asistencia', async () => {
        const newAttendance = { user_id: 1, check_in: '2024-09-25', location: { lat: 8.9833, lng: -79.5167 } };
        const res = await request(app)
            .post('/api/attendance')
            .set('Authorization', `Bearer ${token}`)
            .send(newAttendance);

        expect(res.statusCode).toEqual(201);
        attendanceId = res.body.body.id;
    });

    it('Debería obtener una asistencia por ID', async () => {
        const res = await request(app)
            .get(`/api/attendance/${attendanceId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body[0]).toHaveProperty('id'); 
        expect(res.body.body[0].id).toBe(attendanceId);
    });

    it('Debería eliminar una asistencia existente', async () => {
        const res = await request(app)
            .delete(`/api/attendance/${attendanceId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.body).toEqual('Asistencia eliminada con éxito'); 
    });

    afterAll(async () => {
        await db.endConnection();
    });
});
