import express from 'express';
import { favoriteController } from '../../controller/favorite/favoriteController.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', favoriteController.getFavorites);
router.post('/:petId', favoriteController.addFavorite);
router.delete('/:petId', favoriteController.removeFavorite);

export { router as favoriteRouter }; 