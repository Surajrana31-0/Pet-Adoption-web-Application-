import express from 'express';
import { favoriteController } from '../../controller/favorite/favoriteController.js';
import { authenticateToken } from '../../middleware/token-middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', favoriteController.getFavorites);
router.post('/:petId', favoriteController.addFavorite);
router.delete('/:petId', favoriteController.removeFavorite);

export { router as favoriteRouter }; 