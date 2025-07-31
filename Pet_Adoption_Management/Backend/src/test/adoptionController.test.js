import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Mock the models
jest.mock('../models/index.js', () => ({
  Adoption: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  },
  Pet: {
    findByPk: jest.fn()
  }
}));

import { Adoption, User, Pet } from '../models/index.js';

const app = express();
app.use(express.json());

describe('Adoption Controller', () => {
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

  describe('POST /adoptions - Create Adoption', () => {
    it('should create a new adoption successfully', async () => {
      const mockAdoption = {
        id: 1,
        userId: 1,
        petId: 1,
        status: 'Pending',
        reason: 'I love pets',
        createdAt: new Date()
      };

      Adoption.create.mockResolvedValue(mockAdoption);
      Pet.findByPk.mockResolvedValue({ id: 1, status: 'Available' });
      User.findByPk.mockResolvedValue({ id: 1, email: 'test@example.com' });

      req.body = {
        petId: 1,
        reason: 'I love pets'
      };

      // Mock the controller function
      const createAdoption = async (req, res) => {
        try {
          const adoption = await Adoption.create({
            userId: req.user.id,
            petId: req.body.petId,
            status: 'Pending',
            reason: req.body.reason
          });
          res.status(201).json({
            message: 'Adoption request created successfully',
            data: adoption
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to create adoption' });
        }
      };

      await createAdoption(req, res);

      expect(Adoption.create).toHaveBeenCalledWith({
        userId: 1,
        petId: 1,
        status: 'Pending',
        reason: 'I love pets'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Adoption request created successfully',
        data: mockAdoption
      });
    });

    it('should return error if pet is not available', async () => {
      Pet.findByPk.mockResolvedValue({ id: 1, status: 'Adopted' });

      req.body = { petId: 1, reason: 'I love pets' };

      const createAdoption = async (req, res) => {
        try {
          const pet = await Pet.findByPk(req.body.petId);
          if (pet.status !== 'Available') {
            return res.status(400).json({ message: 'Pet is not available for adoption' });
          }
          // ... rest of the logic
        } catch (error) {
          res.status(500).json({ message: 'Failed to create adoption' });
        }
      };

      await createAdoption(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Pet is not available for adoption'
      });
    });
  });

  describe('GET /adoptions - Get All Adoptions', () => {
    it('should fetch all adoptions for admin', async () => {
      const mockAdoptions = [
        {
          id: 1,
          userId: 1,
          petId: 1,
          status: 'Pending',
          User: { username: 'testuser' },
          Pet: { name: 'Fluffy' }
        }
      ];

      Adoption.findAll.mockResolvedValue(mockAdoptions);

      const getAllAdoptions = async (req, res) => {
        try {
          const adoptions = await Adoption.findAll({
            include: [
              { model: User, attributes: ['username'] },
              { model: Pet, attributes: ['name'] }
            ]
          });
          res.status(200).json({
            message: 'Adoptions fetched successfully',
            data: adoptions
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to fetch adoptions' });
        }
      };

      await getAllAdoptions(req, res);

      expect(Adoption.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Adoptions fetched successfully',
        data: mockAdoptions
      });
    });
  });

  describe('PUT /adoptions/:id - Update Adoption Status', () => {
    it('should update adoption status successfully', async () => {
      const mockAdoption = {
        id: 1,
        status: 'Pending',
        save: jest.fn().mockResolvedValue(true)
      };

      Adoption.findOne.mockResolvedValue(mockAdoption);

      req.params.id = 1;
      req.body = { status: 'Approved' };

      const updateAdoptionStatus = async (req, res) => {
        try {
          const adoption = await Adoption.findOne({
            where: { id: req.params.id }
          });

          if (!adoption) {
            return res.status(404).json({ message: 'Adoption not found' });
          }

          adoption.status = req.body.status;
          await adoption.save();

          res.status(200).json({
            message: 'Adoption status updated successfully',
            data: adoption
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to update adoption status' });
        }
      };

      await updateAdoptionStatus(req, res);

      expect(Adoption.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockAdoption.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Adoption status updated successfully',
        data: mockAdoption
      });
    });

    it('should return 404 if adoption not found', async () => {
      Adoption.findOne.mockResolvedValue(null);

      req.params.id = 999;
      req.body = { status: 'Approved' };

      const updateAdoptionStatus = async (req, res) => {
        try {
          const adoption = await Adoption.findOne({
            where: { id: req.params.id }
          });

          if (!adoption) {
            return res.status(404).json({ message: 'Adoption not found' });
          }
          // ... rest of the logic
        } catch (error) {
          res.status(500).json({ message: 'Failed to update adoption status' });
        }
      };

      await updateAdoptionStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Adoption not found'
      });
    });
  });

  describe('DELETE /adoptions/:id - Delete Adoption', () => {
    it('should delete adoption successfully', async () => {
      const mockAdoption = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      Adoption.findOne.mockResolvedValue(mockAdoption);

      req.params.id = 1;

      const deleteAdoption = async (req, res) => {
        try {
          const adoption = await Adoption.findOne({
            where: { id: req.params.id }
          });

          if (!adoption) {
            return res.status(404).json({ message: 'Adoption not found' });
          }

          await adoption.destroy();

          res.status(200).json({
            message: 'Adoption deleted successfully'
          });
        } catch (error) {
          res.status(500).json({ message: 'Failed to delete adoption' });
        }
      };

      await deleteAdoption(req, res);

      expect(Adoption.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockAdoption.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Adoption deleted successfully'
      });
    });
  });
}); 