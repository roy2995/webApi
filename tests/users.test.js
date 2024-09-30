const request = require('supertest');
const app = require('../src/app'); 

let token;
let userId;

describe('API Users Endpoints', () => {
  
  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/users/login') 
      .send({
        username: 'resquivel',
        password: '220506'
      });

    expect(loginRes.statusCode).toEqual(200);
    token = loginRes.body.accessToken; 
  });

  it('Debería crear un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`) 
      .send({
        username: 'testuser',
        password: 'testpassword'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.body).toHaveProperty('id');
    userId = res.body.body.id;
  });

  it('Debería obtener un usuario por ID', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`); 

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.body)).toBe(true); 
    expect(res.body.body[0]).toHaveProperty('id'); 
    expect(res.body.body[0].id).toBe(userId);
  });

  it('Debería actualizar un usuario existente', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`) 
      .send({
        username: 'updatedUser',
        password: 'updatedPassword'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.body).toEqual('Usuario actualizado exitosamente');
  });

  it('Debería eliminar un usuario existente', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`); 

    expect(res.statusCode).toEqual(200);
    expect(res.body.body).toEqual('User deleted successfully');
  });
});
