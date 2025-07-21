jest.mock('../models/index.js', () => ({
  User: require('../models/user/User.js').User
}));
import { getAll, getById, update, deleteById } from '../controller/user/userController.js';
import { User } from '../models/user/User.js';

jest.mock('../models/user/User.js');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 1 }, query: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
  });

  it('should fetch all users', async () => {
    User.findAll.mockResolvedValue([{ username: 'testuser' }]);
    await getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ data: [{ username: 'testuser' }], message: 'successfully fetched data' });
  });

  it('should fetch user by id', async () => {
    User.findOne.mockResolvedValue({ id: 1, username: 'testuser' });
    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: 'user fetched successfully', data: { id: 1, username: 'testuser' } });
  });

  it('should update user', async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      save: jest.fn().mockResolvedValue(true),
      username: 'olduser',
      email: 'old@example.com',
      firstName: 'Old',
      lastName: 'User',
      phone: '000',
      location: 'Old City',
      address: 'Old Address',
      agreeToTerms: false
    });
    req.body = { username: 'newuser', email: 'new@example.com', firstName: 'New', lastName: 'User', phone: '111', location: 'New City', address: 'New Address', agreeToTerms: true };
    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'user updated successfully' }));
  });

  it('should delete user by id', async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      image_path: null,
      destroy: jest.fn().mockResolvedValue(true)
    });
    await deleteById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: 'user deleted successfully' });
  });
}); 