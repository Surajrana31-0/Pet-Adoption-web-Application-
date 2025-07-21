import request from 'supertest';
import express from 'express';
import petRoute from '../route/pet/petRoute.js';
import { petController } from '../controller/pet/petController.js';

jest.mock('../middleware/auth-middleware.js', () => ({
  requireAuth: (req, res, next) => next(),
  requireAdmin: (req, res, next) => next(),
}));
jest.mock('../controller/pet/petController.js');

const app = express();
app.use(express.json());
app.use('/pets', petRoute);

describe('Pet Routes', () => {
  it('POST /pets should call create', async () => {
    petController.create.mockImplementation((req, res) => res.status(201).json({ name: 'Buddy' }));
    const res = await request(app).post('/pets').send({ name: 'Buddy', type: 'Dog', age: 3 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Buddy');
  });

  it('GET /pets should call getAll', async () => {
    petController.getAll.mockImplementation((req, res) => res.json([{ name: 'Buddy' }]));
    const res = await request(app).get('/pets');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('Buddy');
  });
}); 