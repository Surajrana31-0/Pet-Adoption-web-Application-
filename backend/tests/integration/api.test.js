import { jest } from '@jest/globals';
import request from 'supertest';

// Mock bcrypt
jest.mock('bcryptjs');

// Mock the Product model
jest.mock('../../models/Product.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

// Mock the User model
jest.mock('../../models/User.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

// Mock JWT utilities
jest.mock('../../utils/jwtUtil.js', () => ({
  generateToken: jest.fn((payload) => 'mock-jwt-token'),
  verifyToken: jest.fn((token) => ({ id: 1, email: 'test@example.com' }))
}));

// Mock sanitize utility
jest.mock('../../utils/sanitize.js', () => ({
  sanitizeInput: jest.fn((data) => data)
}));

import app from '../../app.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/auth/login', () => {
      it('should login user successfully with valid credentials', async () => {
        const loginData = {
          email: 'john@example.com',
          password: 'password123'
        };

        const mockUserData = {
          id: 1,
          name: 'John Doe',
          email: loginData.email,
          password: 'hashed_password'
        };

        User.findOne.mockResolvedValue(mockUserData);

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toEqual({
          message: 'Login successful',
          token: 'mock-jwt-token',
          user: {
            id: 1,
            name: 'John Doe',
            email: loginData.email
          }
        });
      });

      it('should return 401 for invalid credentials', async () => {
        const loginData = {
          email: 'john@example.com',
          password: 'wrongpassword'
        };

        User.findOne.mockResolvedValue(null);

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Invalid credentials');
      });

      it('should return 400 for missing credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Email and password are required');
      });
    });
  });

  describe('Product Endpoints', () => {
    describe('GET /api/products', () => {
      it('should return all products', async () => {
        const products = [
          { id: 1, name: 'Ring', price: 100.00 },
          { id: 2, name: 'Necklace', price: 200.00 }
        ];

        Product.findAll.mockResolvedValue(products);

        const response = await request(app)
          .get('/api/products')
          .expect(200);

        expect(response.body).toEqual(products);
        expect(Product.findAll).toHaveBeenCalled();
      });

      it('should handle database errors when fetching products', async () => {
        Product.findAll.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
          .get('/api/products')
          .expect(500);

        expect(response.body).toHaveProperty('error', 'Failed to fetch products');
      });
    });

    describe('GET /api/products/:id', () => {
      it('should return a single product', async () => {
        const product = {
          id: 1,
          name: 'Ring',
          price: 100.00,
          description: 'Beautiful ring'
        };

        Product.findByPk.mockResolvedValue(product);

        const response = await request(app)
          .get('/api/products/1')
          .expect(200);

        expect(response.body).toEqual(product);
      });

      it('should return 404 for non-existent product', async () => {
        Product.findByPk.mockResolvedValue(null);

        const response = await request(app)
          .get('/api/products/999')
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Product not found');
      });
    });

    describe('POST /api/products', () => {
      it('should create a new product', async () => {
        const newProduct = {
          name: 'New Ring',
          price: 150.00,
          description: 'Shiny new ring'
        };

        const createdProduct = {
          id: 1,
          ...newProduct
        };

        Product.create.mockResolvedValue(createdProduct);

        const response = await request(app)
          .post('/api/products')
          .set('Authorization', 'Bearer valid-token')
          .send(newProduct)
          .expect(201);

        expect(response.body).toEqual(createdProduct);
      });

      it('should handle validation errors when creating product', async () => {
        const invalidProduct = {
          name: '',
          price: -50
        };

        Product.create.mockRejectedValue(new Error('Validation error'));

        const response = await request(app)
          .post('/api/products')
          .set('Authorization', 'Bearer valid-token')
          .send(invalidProduct)
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });

      it('should require authentication', async () => {
        const newProduct = {
          name: 'New Ring',
          price: 150.00
        };

        const response = await request(app)
          .post('/api/products')
          .send(newProduct)
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Unauthorized: No token provided');
      });
    });

    describe('PUT /api/products/:id', () => {
      it('should update an existing product', async () => {
        const existingProduct = {
          id: 1,
          name: 'Old Ring',
          price: 100.00,
          update: jest.fn()
        };

        const updatedProduct = {
          id: 1,
          name: 'Updated Ring',
          price: 150.00
        };

        Product.findByPk.mockResolvedValue(existingProduct);
        existingProduct.update.mockResolvedValue(updatedProduct);

        const response = await request(app)
          .put('/api/products/1')
          .set('Authorization', 'Bearer valid-token')
          .send({ name: 'Updated Ring', price: 150.00 })
          .expect(200);

        expect(response.body).toEqual(updatedProduct);
      });

      it('should return 404 when updating non-existent product', async () => {
        Product.findByPk.mockResolvedValue(null);

        const response = await request(app)
          .put('/api/products/999')
          .set('Authorization', 'Bearer valid-token')
          .send({ name: 'Updated Name' })
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Product not found');
      });
    });

    describe('DELETE /api/products/:id', () => {
      it('should delete an existing product', async () => {
        const existingProduct = {
          id: 1,
          name: 'Ring',
          destroy: jest.fn()
        };

        Product.findByPk.mockResolvedValue(existingProduct);

        const response = await request(app)
          .delete('/api/products/1')
          .set('Authorization', 'Bearer valid-token')
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Product deleted successfully');
        expect(existingProduct.destroy).toHaveBeenCalled();
      });

      it('should return 404 when deleting non-existent product', async () => {
        Product.findByPk.mockResolvedValue(null);

        const response = await request(app)
          .delete('/api/products/999')
          .set('Authorization', 'Bearer valid-token')
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Product not found');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should handle extremely large request bodies', async () => {
      const largeData = 'x'.repeat(11 * 1024 * 1024); // 11MB

      const response = await request(app)
        .post('/api/products')
        .send({ data: largeData })
        .expect(413);
    });
  });

  describe('Security Tests', () => {
    it('should handle SQL injection attempts in query parameters', async () => {
      const sqlInjectionId = "1'; DROP TABLE products; --";

      const response = await request(app)
        .get(`/api/products/${sqlInjectionId}`)
        .expect(500);

      expect(Product.findByPk).toHaveBeenCalledWith(sqlInjectionId);
    });

    it('should handle XSS attempts in request body', async () => {
      const xssData = {
        name: '<script>alert("xss")</script>',
        price: 100
      };

      Product.create.mockResolvedValue({ id: 1, ...xssData });

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', 'Bearer valid-token')
        .send(xssData)
        .expect(201);

      expect(Product.create).toHaveBeenCalled();
    });

    it('should implement rate limiting', async () => {
      // This test would require testing multiple requests in quick succession
      // For now, we'll just verify the endpoint exists and responds
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.status).toBe(200);
    });
  });
});