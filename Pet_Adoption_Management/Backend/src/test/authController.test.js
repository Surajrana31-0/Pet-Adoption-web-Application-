import { login, signup, requestPasswordReset, confirmPasswordReset } from '../controller/auth/authController.js';
import { User } from '../models/user/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../security/jwt-util.js';

jest.mock('../models/user/User.js');
jest.mock('bcryptjs');
jest.mock('../security/jwt-util.js');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashed', role: 'user' });
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('token');
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ data: { access_token: 'token' }, message: 'Login successful' });
    });
    it('should fail if user not found', async () => {
      req.body = { email: 'notfound@example.com', password: 'password' };
      User.findOne.mockResolvedValue(null);
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    it('should fail if password is invalid', async () => {
      req.body = { email: 'test@example.com', password: 'wrong' };
      User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashed', role: 'user' });
      bcrypt.compare.mockResolvedValue(false);
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });
  });

  describe('signup', () => {
    it('should signup successfully', async () => {
      req.body = { username: 'testuser', email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User', phone: '123', location: 'City', address: 'Addr', agreeToTerms: true };
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      User.create.mockResolvedValue({});
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Signup successful' });
    });
    it('should fail if user exists', async () => {
      req.body = { username: 'testuser', email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User', phone: '123', location: 'City', address: 'Addr', agreeToTerms: true };
      User.findOne.mockResolvedValue({});
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });
}); 