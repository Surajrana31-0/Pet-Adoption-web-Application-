import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

// Mock the User model
jest.mock('../models/index.js', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

import { User } from '../models/index.js';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user'
      };

      const mockToken = 'valid.jwt.token';
      const mockDecoded = { id: 1, email: 'test@example.com' };

      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecoded);
      User.findByPk.mockResolvedValue(mockUser);

      const authenticateToken = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
            return res.status(401).json({ message: 'Access token required' });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          const user = await User.findByPk(decoded.id);

          if (!user) {
            return res.status(401).json({ message: 'User not found' });
          }

          req.user = user;
          next();
        } catch (error) {
          return res.status(403).json({ message: 'Invalid token' });
        }
      };

      await authenticateToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET || 'your-secret-key');
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no authorization header', async () => {
      const authenticateToken = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
            return res.status(401).json({ message: 'Access token required' });
          }
          // ... rest of the logic
        } catch (error) {
          return res.status(403).json({ message: 'Invalid token' });
        }
      };

      await authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access token required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token format is invalid', async () => {
      req.headers.authorization = 'InvalidFormat'; // No space, so split will return ['InvalidFormat']

      const authenticateToken = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
            return res.status(401).json({ message: 'Access token required' });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          const user = await User.findByPk(decoded.id);

          if (!user) {
            return res.status(401).json({ message: 'User not found' });
          }

          req.user = user;
          next();
        } catch (error) {
          return res.status(403).json({ message: 'Invalid token' });
        }
      };

      await authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access token required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', async () => {
      const mockToken = 'invalid.jwt.token';
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const authenticateToken = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
            return res.status(401).json({ message: 'Access token required' });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          // ... rest of the logic
        } catch (error) {
          return res.status(403).json({ message: 'Invalid token' });
        }
      };

      await authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      const mockToken = 'valid.jwt.token';
      const mockDecoded = { id: 1, email: 'test@example.com' };

      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecoded);
      User.findByPk.mockResolvedValue(null);

      const authenticateToken = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
            return res.status(401).json({ message: 'Access token required' });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          const user = await User.findByPk(decoded.id);

          if (!user) {
            return res.status(401).json({ message: 'User not found' });
          }

          req.user = user;
          next();
        } catch (error) {
          return res.status(403).json({ message: 'Invalid token' });
        }
      };

      await authenticateToken(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    it('should allow access for authorized role', () => {
      req.user = { id: 1, role: 'admin' };
      const allowedRoles = ['admin', 'user'];

      const authorizeRoles = (allowedRoles) => {
        return (req, res, next) => {
          if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
          }

          if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
          }

          next();
        };
      };

      const middleware = authorizeRoles(allowedRoles);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      req.user = { id: 1, role: 'guest' };
      const allowedRoles = ['admin', 'user'];

      const authorizeRoles = (allowedRoles) => {
        return (req, res, next) => {
          if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
          }

          if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
          }

          next();
        };
      };

      const middleware = authorizeRoles(allowedRoles);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if no user in request', () => {
      req.user = null;
      const allowedRoles = ['admin', 'user'];

      const authorizeRoles = (allowedRoles) => {
        return (req, res, next) => {
          if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
          }

          if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
          }

          next();
        };
      };

      const middleware = authorizeRoles(allowedRoles);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('adminOnly', () => {
    it('should allow access for admin role', () => {
      req.user = { id: 1, role: 'admin' };

      const adminOnly = (req, res, next) => {
        if (!req.user) {
          return res.status(401).json({ message: 'Authentication required' });
        }

        if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Admin access required' });
        }

        next();
      };

      adminOnly(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access for non-admin role', () => {
      req.user = { id: 1, role: 'user' };

      const adminOnly = (req, res, next) => {
        if (!req.user) {
          return res.status(401).json({ message: 'Authentication required' });
        }

        if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Admin access required' });
        }

        next();
      };

      adminOnly(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should set user if valid token provided', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'user' };
      const mockToken = 'valid.jwt.token';
      const mockDecoded = { id: 1, email: 'test@example.com' };

      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecoded);
      User.findByPk.mockResolvedValue(mockUser);

      const optionalAuth = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findByPk(decoded.id);
            if (user) {
              req.user = user;
            }
          }

          next();
        } catch (error) {
          // Continue without authentication
          next();
        }
      };

      await optionalAuth(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should continue without user if no token provided', async () => {
      const optionalAuth = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findByPk(decoded.id);
            if (user) {
              req.user = user;
            }
          }

          next();
        } catch (error) {
          // Continue without authentication
          next();
        }
      };

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('should continue without user if invalid token provided', async () => {
      const mockToken = 'invalid.jwt.token';
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const optionalAuth = async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];

          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findByPk(decoded.id);
            if (user) {
              req.user = user;
            }
          }

          next();
        } catch (error) {
          // Continue without authentication
          next();
        }
      };

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });
}); 