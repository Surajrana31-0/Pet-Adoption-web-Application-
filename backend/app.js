import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { protect } from './middleware/authMiddleware.js';
import { registerUser, loginUser } from './controllers/authController.js';
import { 
  getProducts, 
  getProduct, 
  createProductHandler, 
  updateProductHandler, 
  deleteProductHandler 
} from './controllers/productController.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Error handling middleware for malformed JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

// Auth routes
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// Product routes
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProduct);
app.post('/api/products', protect, createProductHandler);
app.put('/api/products/:id', protect, updateProductHandler);
app.delete('/api/products/:id', protect, deleteProductHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;