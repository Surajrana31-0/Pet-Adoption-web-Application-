import { jest } from '@jest/globals';
import { errorHandler, notFound } from '../../middleware/errorMiddleware.js';

describe('Error Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Mock console.error to avoid test output pollution
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle generic errors', () => {
      const error = new Error('Test error');
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test error'
      });
    });

    it('should handle CastError (Mongoose bad ObjectId)', () => {
      const error = new Error('Cast failed');
      error.name = 'CastError';
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Resource not found'
      });
    });

    it('should handle duplicate key errors', () => {
      const error = new Error('Duplicate key');
      error.code = 11000;
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Duplicate field value entered'
      });
    });

    it('should handle ValidationError', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {
        name: { message: 'Name is required' },
        email: { message: 'Email is invalid' }
      };
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ['Name is required', 'Email is invalid']
      });
    });

    it('should handle JsonWebTokenError', () => {
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid token'
      });
    });

    it('should handle TokenExpiredError', () => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token expired'
      });
    });

    it('should handle errors with custom statusCode', () => {
      const error = new Error('Custom error');
      error.statusCode = 422;
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Custom error'
      });
    });

    it('should log errors to console', () => {
      const error = new Error('Test error');
      
      errorHandler(error, req, res, next);
      
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('notFound', () => {
    it('should create 404 error for non-existent routes', () => {
      req.originalUrl = '/api/nonexistent';
      
      notFound(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      
      const errorArg = next.mock.calls[0][0];
      expect(errorArg.message).toBe('Not found - /api/nonexistent');
    });

    it('should pass error to next middleware', () => {
      notFound(req, res, next);
      
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});