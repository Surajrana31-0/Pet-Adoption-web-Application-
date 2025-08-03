import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');

// Mock the User model
jest.mock('../../models/User.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

// Mock JWT utility
jest.mock('../../utils/jwtUtil.js', () => ({
  generateToken: jest.fn()
}));

import User from '../../models/User.js';
import { generateToken } from '../../utils/jwtUtil.js';
import { registerUser, loginUser } from '../../controllers/authController.js';

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('POST /auth/register - Register User', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashed_password_123';
      const mockCreatedUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      };

      const mockToken = 'jwt_token_123';

      req.body = userData;
      User.findOne.mockResolvedValue(null); // User doesn't exist
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(mockCreatedUser);
      generateToken.mockReturnValue(mockToken);

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      });
      expect(generateToken).toHaveBeenCalledWith({ id: 1, email: userData.email });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        token: mockToken,
        user: {
          id: 1,
          name: userData.name,
          email: userData.email
        }
      });
    });

    it('should return error when required fields are missing', async () => {
      req.body = {
        email: 'test@example.com'
        // Missing name and password
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    });

    it('should validate email format', async () => {
      req.body = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid email format'
      });
    });

    it('should return error when user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      req.body = userData;
      User.findOne.mockResolvedValue({ id: 1, email: userData.email }); // User exists

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    it('should handle database errors during registration', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      req.body = userData;
      User.findOne.mockRejectedValue(new Error('Database error'));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
    });
  });

  describe('POST /auth/login - Login User', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: loginData.email,
        password: hashedPassword
      };

      const mockToken = 'jwt_token_123';

      req.body = loginData;
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue(mockToken);

      await loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, hashedPassword);
      expect(generateToken).toHaveBeenCalledWith({ id: 1, email: loginData.email });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: mockToken,
        user: {
          id: 1,
          name: 'John Doe',
          email: loginData.email
        }
      });
    });

    it('should return error when required fields are missing', async () => {
      req.body = {
        email: 'test@example.com'
        // Missing password
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
    });

    it('should return error when user not found', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      req.body = loginData;
      User.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return error when password is incorrect', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        password: 'hashed_password_123'
      };

      req.body = loginData;
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should use timing-safe comparison for password verification', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        email: loginData.email,
        password: hashedPassword
      };

      req.body = loginData;
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await loginUser(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', hashedPassword);
    });
  });
});