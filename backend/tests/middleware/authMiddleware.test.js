import { jest } from '@jest/globals';
import { protect } from '../../middleware/authMiddleware.js';

// Mock the entire jwtUtil module
jest.mock('../../utils/jwtUtil.js', () => ({
  verifyToken: jest.fn()
}));

import { verifyToken } from '../../utils/jwtUtil.js';

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
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should allow access with valid token', () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      req.headers.authorization = 'Bearer valid-token';
      verifyToken.mockReturnValue(mockUser);

      protect(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith('valid-token');
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should deny access when no authorization header', () => {
      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when authorization header does not start with Bearer', () => {
      req.headers.authorization = 'Invalid token format';

      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when token is empty after Bearer', () => {
      req.headers.authorization = 'Bearer ';

      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when token verification throws an error', () => {
      req.headers.authorization = 'Bearer error-token';
      verifyToken.mockImplementation(() => {
        throw new Error('Token verification failed');
      });

      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle authorization header with extra spaces', () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      req.headers.authorization = 'Bearer   valid-token-here   ';
      verifyToken.mockReturnValue(mockUser);

      protect(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith('valid-token-here');
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should not expose sensitive information in error messages', () => {
      req.headers.authorization = 'Bearer invalid-token';
      verifyToken.mockImplementation(() => {
        throw new Error('JWT_SECRET is invalid');
      });

      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
      expect(res.json).not.toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('JWT_SECRET')
        })
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing headers object', () => {
      req.headers = undefined;

      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    });

    it('should handle missing next function', () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      req.headers.authorization = 'Bearer valid-token';
      verifyToken.mockReturnValue(mockUser);
      next = undefined;

      expect(() => {
        protect(req, res, next);
      }).toThrow();
    });
  });
});