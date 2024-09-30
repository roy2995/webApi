const request = require('supertest');
const app = require('../src/app'); // Cambia esto si es necesario
let token; // Guardará el token de autorización
let taskBucketId;

describe('API Task Buckets Endpoints', () => {

  // Iniciar sesión antes de las pruebas
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'resquivel', // Cambia si es necesario
        password: '220506' // Cambia si es necesario
      });

    console.log('Respuesta de login completa:', res.body); // Depura el token obtenido
    token = res.body.accessToken;

    // Verificar si se obtuvo un token
    if (!token) {
      throw new Error('No se obtuvo un token. Deteniendo pruebas.');
    }
  });

  // Crear una nueva relación tarea-bucket
  it('Debería crear una nueva relación tarea-bucket', async () => {
    const newTaskBucket = {
      task_id: 1,
      bucket_id: 1,
      contingencie_id: 1
    };
    const res = await request(app)
      .post('/api/task_buckets')
      .set('Authorization', `Bearer ${token}`)
      .send(newTaskBucket);

    expect(res.statusCode).toEqual(201);
    expect(res.body.body).toHaveProperty('id');
    taskBucketId = res.body.body.id; // Guardamos el ID de la relación creada
  });

  // Obtener las relaciones de una tarea específica por ID de tarea
  it('Debería obtener las relaciones de una tarea específica por ID de tarea', async () => {
    const res = await request(app)
      .get(`/api/task_buckets/1`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);

    // Validamos si hay datos en el array
    if (res.body.body.length > 0) {
      expect(res.body.body[0]).toHaveProperty('task_id');
      expect(res.body.body[0].task_id).toBe(1); // Verificamos que el task_id es correcto
    }
  });

  // Actualizar una relación tarea-bucket existente
  it('Debería actualizar una relación tarea-bucket existente', async () => {
    const updatedTaskBucket = {
      task_id: 1,
      bucket_id: 2,
      contingencie_id: 2
    };

    const res = await request(app)
      .put(`/api/task_buckets/${taskBucketId}`) // Asegúrate de que taskBucketId existe y es válido
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTaskBucket);

    console.log('Respuesta de actualización completa:', res.body);

    expect(res.statusCode).toEqual(200); // Cambia a 200 si es el código correcto que esperas
    expect(res.body.body).toEqual('Relación entre tarea y bucket actualizada exitosamente'); // Reemplaza según la respuesta correcta
  });

  // Eliminar una relación tarea-bucket existente
  it('Debería eliminar una relación tarea-bucket existente', async () => {
    const res = await request(app)
      .delete(`/api/task_buckets/${taskBucketId}`) // Utilizar el ID guardado
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.body).toEqual('Relación entre tarea y bucket eliminada exitosamente');
  });

  // Cerrar sesión o limpiar después de las pruebas
  afterAll(async () => {
    token = null;
  });
});
