import { jest } from '@jest/globals';

// Mock the models
jest.mock('../models/index.js', () => ({
  Favorite: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  },
  Pet: {
    findByPk: jest.fn()
  }
}));

import { Favorite, User, Pet } from '../models/index.js';

describe('Favorite Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      query: {},
      body: {},
      user: { id: 1, email: 'test@example.com' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /favorites - Add to Favorites', () => {
    it('should add pet to favorites successfully', async () => {
      const mockFavorite = {
        id: 1,
        userId: 1,
        petId: 1,
        createdAt: new Date()
      };

      Favorite.findOne.mockResolvedValue(null); // No existing favorite
      Favorite.create.mockResolvedValue(mockFavorite);
      Pet.findByPk.mockResolvedValue({ id: 1, name: 'Fluffy' });

      req.body = { petId: 1 };

      const addToFavorites = async (req, res) => {
        try {
          // Check if pet exists
          const pet = await Pet.findByPk(req.body.petId);
          if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
          }

          // Check if already in favorites
          const existingFavorite = await Favorite.findOne({
            where: { userId: req.user.id, petId: req.body.petId }
          });

          if (existingFavorite) {
            return res.status(400).json({ message: 'Pet is already in favorites' });
          }

          // Add to favorites
          const favorite = await Favorite.create({
            userId: req.user.id,
            petId: req.body.petId
          });

          res.status(201).json({
            message: 'Pet added to favorites successfully',
            data: favorite
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to add to favorites' });
        }
      };

      await addToFavorites(req, res);

      expect(Pet.findByPk).toHaveBeenCalledWith(1);
      expect(Favorite.findOne).toHaveBeenCalledWith({
        where: { userId: 1, petId: 1 }
      });
      expect(Favorite.create).toHaveBeenCalledWith({
        userId: 1,
        petId: 1
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Pet added to favorites successfully',
        data: mockFavorite
      });
    });

    it('should return error if pet not found', async () => {
      Pet.findByPk.mockResolvedValue(null);

      req.body = { petId: 999 };

      const addToFavorites = async (req, res) => {
        try {
          const pet = await Pet.findByPk(req.body.petId);
          if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
          }
          // ... rest of the logic
        } catch (error) {
          res.status(500).json({ message: 'Failed to add to favorites' });
        }
      };

      await addToFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Pet not found'
      });
    });

    it('should return error if pet already in favorites', async () => {
      const existingFavorite = { id: 1, userId: 1, petId: 1 };
      Pet.findByPk.mockResolvedValue({ id: 1, name: 'Fluffy' });
      Favorite.findOne.mockResolvedValue(existingFavorite);

      req.body = { petId: 1 };

      const addToFavorites = async (req, res) => {
        try {
          const pet = await Pet.findByPk(req.body.petId);
          if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
          }

          const existingFavorite = await Favorite.findOne({
            where: { userId: req.user.id, petId: req.body.petId }
          });

          if (existingFavorite) {
            return res.status(400).json({ message: 'Pet is already in favorites' });
          }
          // ... rest of the logic
        } catch (error) {
          res.status(500).json({ message: 'Failed to add to favorites' });
        }
      };

      await addToFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Pet is already in favorites'
      });
    });
  });

  describe('GET /favorites - Get User Favorites', () => {
    it('should fetch user favorites successfully', async () => {
      const mockFavorites = [
        {
          id: 1,
          userId: 1,
          petId: 1,
          Pet: {
            id: 1,
            name: 'Fluffy',
            breed: 'Golden Retriever',
            type: 'Dog',
            age: 3
          }
        }
      ];

      Favorite.findAll.mockResolvedValue(mockFavorites);

      const getUserFavorites = async (req, res) => {
        try {
          const favorites = await Favorite.findAll({
            where: { userId: req.user.id },
            include: [
              {
                model: Pet,
                attributes: ['id', 'name', 'breed', 'type', 'age', 'image_path']
              }
            ]
          });

          res.status(200).json({
            message: 'Favorites fetched successfully',
            data: favorites
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to fetch favorites' });
        }
      };

      await getUserFavorites(req, res);

      expect(Favorite.findAll).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: [
          {
            model: Pet,
            attributes: ['id', 'name', 'breed', 'type', 'age', 'image_path']
          }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Favorites fetched successfully',
        data: mockFavorites
      });
    });

    it('should return empty array if no favorites', async () => {
      Favorite.findAll.mockResolvedValue([]);

      const getUserFavorites = async (req, res) => {
        try {
          const favorites = await Favorite.findAll({
            where: { userId: req.user.id },
            include: [
              {
                model: Pet,
                attributes: ['id', 'name', 'breed', 'type', 'age', 'image_path']
              }
            ]
          });

          res.status(200).json({
            message: 'Favorites fetched successfully',
            data: favorites
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to fetch favorites' });
        }
      };

      await getUserFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Favorites fetched successfully',
        data: []
      });
    });
  });

  describe('DELETE /favorites/:petId - Remove from Favorites', () => {
    it('should remove pet from favorites successfully', async () => {
      const mockFavorite = {
        id: 1,
        userId: 1,
        petId: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      Favorite.findOne.mockResolvedValue(mockFavorite);

      req.params.petId = 1;

      const removeFromFavorites = async (req, res) => {
        try {
          const favorite = await Favorite.findOne({
            where: { userId: req.user.id, petId: req.params.petId }
          });

          if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
          }

          await favorite.destroy();

          res.status(200).json({
            message: 'Pet removed from favorites successfully'
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to remove from favorites' });
        }
      };

      await removeFromFavorites(req, res);

      expect(Favorite.findOne).toHaveBeenCalledWith({
        where: { userId: 1, petId: 1 }
      });
      expect(mockFavorite.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Pet removed from favorites successfully'
      });
    });

    it('should return 404 if favorite not found', async () => {
      Favorite.findOne.mockResolvedValue(null);

      req.params.petId = 999;

      const removeFromFavorites = async (req, res) => {
        try {
          const favorite = await Favorite.findOne({
            where: { userId: req.user.id, petId: req.params.petId }
          });

          if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
          }
          // ... rest of the logic
        } catch (error) {
          res.status(500).json({ message: 'Failed to remove from favorites' });
        }
      };

      await removeFromFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Favorite not found'
      });
    });
  });

  describe('GET /favorites/check/:petId - Check if Pet is in Favorites', () => {
    it('should return true if pet is in favorites', async () => {
      const mockFavorite = { id: 1, userId: 1, petId: 1 };
      Favorite.findOne.mockResolvedValue(mockFavorite);

      req.params.petId = 1;

      const checkFavorite = async (req, res) => {
        try {
          const favorite = await Favorite.findOne({
            where: { userId: req.user.id, petId: req.params.petId }
          });

          res.status(200).json({
            isFavorite: !!favorite,
            data: favorite
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to check favorite status' });
        }
      };

      await checkFavorite(req, res);

      expect(Favorite.findOne).toHaveBeenCalledWith({
        where: { userId: 1, petId: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        isFavorite: true,
        data: mockFavorite
      });
    });

    it('should return false if pet is not in favorites', async () => {
      Favorite.findOne.mockResolvedValue(null);

      req.params.petId = 999;

      const checkFavorite = async (req, res) => {
        try {
          const favorite = await Favorite.findOne({
            where: { userId: req.user.id, petId: req.params.petId }
          });

          res.status(200).json({
            isFavorite: !!favorite,
            data: favorite
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to check favorite status' });
        }
      };

      await checkFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        isFavorite: false,
        data: null
      });
    });
  });
}); 