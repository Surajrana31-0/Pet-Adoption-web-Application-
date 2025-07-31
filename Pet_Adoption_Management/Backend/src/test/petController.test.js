import { petController } from '../controller/pet/petController.js';
import Pet from '../models/pet/Pet.js';

jest.mock('../models/pet/Pet.js');

describe('Pet Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { name: 'Buddy', type: 'Dog', age: 3 }, params: { id: 1 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it('should create a Pet', async () => {
    Pet.create.mockResolvedValue(req.body);
    await petController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: req.body });
  });

  it('should retrieve all Pets', async () => {
    Pet.findAll.mockResolvedValue([req.body]);
    await petController.getAll(req, res);
    expect(res.json).toHaveBeenCalledWith({ data: [req.body] });
  });

  it('should handle non-existent Pet', async () => {
    Pet.findByPk.mockResolvedValue(null);
    await petController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pet not found' });
  });
}); 