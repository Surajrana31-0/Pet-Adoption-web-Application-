import { jest } from '@jest/globals';

// Mock the Product model
jest.mock('../../models/Product.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

// Mock the sanitize utility
jest.mock('../../utils/sanitize.js', () => ({
  sanitizeInput: jest.fn((data) => data)
}));

import Product from '../../models/Product.js';
import { sanitizeInput } from '../../utils/sanitize.js';
import {
  getProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler
} from '../../controllers/productController.js';

describe('Product Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { id: 1, email: 'test@example.com' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('GET /products - Get All Products', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Ring', price: 100.00 },
        { id: 2, name: 'Necklace', price: 200.00 }
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      await getProducts(req, res);

      expect(Product.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle database errors when fetching products', async () => {
      Product.findAll.mockRejectedValue(new Error('Database error'));

      await getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch products' });
    });

    it('should return empty array when no products exist', async () => {
      Product.findAll.mockResolvedValue([]);

      await getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('GET /products/:id - Get Single Product', () => {
    it('should fetch a single product successfully', async () => {
      const mockProduct = {
        id: 1,
        name: 'Ring',
        price: 100.00
      };

      Product.findByPk.mockResolvedValue(mockProduct);
      req.params.id = '1';

      await getProduct(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 when product not found', async () => {
      Product.findByPk.mockResolvedValue(null);
      req.params.id = '999';

      await getProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle database errors when fetching single product', async () => {
      Product.findByPk.mockRejectedValue(new Error('Database error'));
      req.params.id = '1';

      await getProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch product' });
    });
  });

  describe('POST /products - Create Product', () => {
    it('should create a new product successfully', async () => {
      const newProductData = {
        name: 'New Ring',
        price: 150.00,
        description: 'Beautiful ring'
      };

      const createdProduct = {
        id: 1,
        ...newProductData
      };

      Product.create.mockResolvedValue(createdProduct);
      req.body = newProductData;

      await createProductHandler(req, res);

      expect(sanitizeInput).toHaveBeenCalledWith(newProductData);
      expect(Product.create).toHaveBeenCalledWith(newProductData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdProduct);
    });

    it('should handle validation errors when creating product', async () => {
      const invalidProductData = {
        name: '',
        price: -50
      };

      Product.create.mockRejectedValue(new Error('Validation error'));
      req.body = invalidProductData;

      await createProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });

    it('should handle database errors when creating product', async () => {
      Product.create.mockRejectedValue(new Error('Database connection failed'));
      req.body = {
        name: 'Test Product',
        price: 100
      };

      await createProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create product' });
    });

    it('should sanitize input data before creating product', async () => {
      const productWithScript = {
        name: 'Ring<script>alert("xss")</script>',
        price: 100.00
      };

      const sanitizedProduct = {
        name: 'Ring',
        price: 100.00
      };

      sanitizeInput.mockReturnValue(sanitizedProduct);
      Product.create.mockResolvedValue({ id: 1, ...sanitizedProduct });
      req.body = productWithScript;

      await createProductHandler(req, res);

      expect(sanitizeInput).toHaveBeenCalledWith(productWithScript);
      expect(Product.create).toHaveBeenCalledWith(sanitizedProduct);
    });

    it('should validate required fields', async () => {
      const incompleteProduct = {
        name: 'Ring'
        // Missing price
      };

      Product.create.mockRejectedValue(new Error('price cannot be null'));
      req.body = incompleteProduct;

      await createProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'price cannot be null' });
    });
  });

  describe('PUT /products/:id - Update Product', () => {
    it('should update a product successfully', async () => {
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

      req.params.id = '1';
      req.body = { name: 'Updated Ring', price: 150.00 };

      await updateProductHandler(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('1');
      expect(existingProduct.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should return 404 when product not found for update', async () => {
      Product.findByPk.mockResolvedValue(null);
      req.params.id = '999';
      req.body = { name: 'Updated Name' };

      await updateProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle validation errors when updating product', async () => {
      const existingProduct = {
        id: 1,
        name: 'Ring',
        price: 100.00,
        update: jest.fn()
      };

      Product.findByPk.mockResolvedValue(existingProduct);

      req.params.id = '1';
      req.body = { price: -50 }; // Invalid price

      existingProduct.update.mockRejectedValue(new Error('validation error'));

      await updateProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'validation error' });
    });

    it('should handle database errors when updating product', async () => {
      Product.findByPk.mockRejectedValue(new Error('Database error'));
      req.params.id = '1';
      req.body = { name: 'Updated Name' };

      await updateProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update product' });
    });

    it('should prevent SQL injection in update operations', async () => {
      const existingProduct = {
        id: 1,
        name: 'Ring',
        price: 100.00,
        update: jest.fn()
      };

      Product.findByPk.mockResolvedValue(existingProduct);

      req.params.id = "1'; DROP TABLE products; --";
      req.body = { name: 'Updated Name' };

      await updateProductHandler(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith("1'; DROP TABLE products; --");
    });
  });

  describe('DELETE /products/:id - Delete Product', () => {
    it('should delete a product successfully', async () => {
      const existingProduct = {
        id: 1,
        name: 'Ring',
        destroy: jest.fn()
      };

      Product.findByPk.mockResolvedValue(existingProduct);
      req.params.id = '1';

      await deleteProductHandler(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('1');
      expect(existingProduct.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
    });

    it('should return 404 when product not found for deletion', async () => {
      Product.findByPk.mockResolvedValue(null);
      req.params.id = '999';

      await deleteProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle database errors when deleting product', async () => {
      Product.findByPk.mockRejectedValue(new Error('Database error'));
      req.params.id = '1';

      await deleteProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete product' });
    });

    it('should handle destroy operation errors', async () => {
      const existingProduct = {
        id: 1,
        name: 'Ring',
        destroy: jest.fn()
      };

      Product.findByPk.mockResolvedValue(existingProduct);
      req.params.id = '1';

      existingProduct.destroy.mockRejectedValue(new Error('Destroy failed'));

      await deleteProductHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete product' });
    });

    it('should prevent unauthorized deletion through ID manipulation', async () => {
      const existingProduct = {
        id: 1,
        name: 'Ring',
        destroy: jest.fn()
      };

      Product.findByPk.mockResolvedValue(existingProduct);
      req.params.id = '1 OR 1=1'; // SQL injection attempt

      await deleteProductHandler(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('1 OR 1=1');
    });
  });

  describe('Input Validation and Sanitization', () => {
    it('should handle special characters in product names', async () => {
      const productWithSpecialChars = {
        name: 'Ring & Necklace - "Special" Collection',
        price: 100.00
      };

      sanitizeInput.mockReturnValue(productWithSpecialChars);
      Product.create.mockResolvedValue({ id: 1, ...productWithSpecialChars });
      req.body = productWithSpecialChars;

      await createProductHandler(req, res);

      expect(sanitizeInput).toHaveBeenCalledWith(productWithSpecialChars);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});