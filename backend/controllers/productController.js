import Product from '../models/Product.js';
import { sanitizeInput } from '../utils/sanitize.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProductHandler = async (req, res) => {
  try {
    // Sanitize input data
    const sanitizedData = sanitizeInput(req.body);
    
    const product = await Product.create(sanitizedData);
    res.status(201).json(product);
  } catch (error) {
    if (error.message.includes('validation') || error.message.includes('cannot be null')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = await product.update(req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.message.includes('validation')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};