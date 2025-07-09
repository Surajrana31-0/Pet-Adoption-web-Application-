import SequelizeMock from 'sequelize-mock';
import petController from '../controllers/petController';

// Mock Sequelize DB and Pet model INSIDE jest.mock
jest.mock('../models', () => {
  const DBConnectionMock = new SequelizeMock();
  const mockPet = DBConnectionMock.define('Pet', {
    id: 1,
    name: 'Buddy',
    type: 'Dog',
    age: 2,
    adopted: false,
  });
  return { Pet: mockPet };
});

import { Pet } from '../models'; // Import after jest.mock

describe('petController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it('should get all pets', async () => {
    Pet.$queueResult([
      Pet.build({ id: 1, name: 'Buddy', type: 'Dog', age: 2, adopted: false }),
      Pet.build({ id: 2, name: 'Milo', type: 'Cat', age: 1, adopted: false }),
    ]);
    await petController.getAllPets(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'Buddy' }),
      expect.objectContaining({ name: 'Milo' }),
    ]);
  });

  it('should create a new pet', async () => {
    req.body = { name: 'Charlie', type: 'Dog', age: 3, adopted: false };
    await petController.createPet(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Charlie' }));
  });

  it('should update a pet', async () => {
  req.params = { id: 1 };
  req.body = { name: 'Buddy Updated', age: 3 };
  Pet.$queueResult([1]); // Sequelize update returns [number of affected rows]
  await petController.updatePet(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Pet updated successfully' })
  );
});

it('should delete a pet', async () => {
  req.params = { id: 1 };
  Pet.$queueResult(1); // Sequelize destroy returns number of deleted rows
  await petController.deletePet(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Pet deleted successfully' })
  );
}); 

