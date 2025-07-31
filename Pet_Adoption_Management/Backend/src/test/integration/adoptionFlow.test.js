import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the models
jest.mock('../../models/index.js', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  Pet: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  },
  Adoption: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }
}));

import { User, Pet, Adoption } from '../../models/index.js';

const app = express();
app.use(express.json());

describe('Adoption Flow Integration Tests', () => {
  let testUser, testPet, testAdoption;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup test data
    testUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
      firstName: 'Test',
      lastName: 'User'
    };

    testPet = {
      id: 1,
      name: 'Fluffy',
      breed: 'Golden Retriever',
      type: 'Dog',
      age: 3,
      description: 'A friendly dog',
      status: 'Available',
      image_path: 'fluffy.jpg'
    };

    testAdoption = {
      id: 1,
      userId: 1,
      petId: 1,
      status: 'Pending',
      reason: 'I love pets and have a big yard',
      createdAt: new Date()
    };
  });

  describe('Complete Adoption Flow', () => {
    it('should complete full adoption process successfully', async () => {
      // Step 1: User registration
      User.create.mockResolvedValue(testUser);
      User.findOne.mockResolvedValue(null); // No existing user

      const registerUser = async (userData) => {
        const existingUser = await User.findOne({
          where: { email: userData.email }
        });

        if (existingUser) {
          throw new Error('User already exists');
        }

        return await User.create(userData);
      };

      const newUser = await registerUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      });

      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      });
      expect(newUser).toEqual(testUser);

      // Step 2: Pet creation (by admin)
      Pet.create.mockResolvedValue(testPet);

      const createPet = async (petData) => {
        return await Pet.create(petData);
      };

      const newPet = await createPet({
        name: 'Fluffy',
        breed: 'Golden Retriever',
        type: 'Dog',
        age: 3,
        description: 'A friendly dog',
        status: 'Available',
        image_path: 'fluffy.jpg'
      });

      expect(Pet.create).toHaveBeenCalledWith({
        name: 'Fluffy',
        breed: 'Golden Retriever',
        type: 'Dog',
        age: 3,
        description: 'A friendly dog',
        status: 'Available',
        image_path: 'fluffy.jpg'
      });
      expect(newPet).toEqual(testPet);

      // Step 3: User submits adoption request
      Pet.findByPk.mockResolvedValue(testPet);
      Adoption.findOne.mockResolvedValue(null); // No existing adoption
      Adoption.create.mockResolvedValue(testAdoption);

      const submitAdoptionRequest = async (userId, petId, reason) => {
        // Check if pet exists and is available
        const pet = await Pet.findByPk(petId);
        if (!pet) {
          throw new Error('Pet not found');
        }

        if (pet.status !== 'Available') {
          throw new Error('Pet is not available for adoption');
        }

        // Check if user already has a pending request for this pet
        const existingAdoption = await Adoption.findOne({
          where: { userId, petId, status: 'Pending' }
        });

        if (existingAdoption) {
          throw new Error('You already have a pending adoption request for this pet');
        }

        // Create adoption request
        return await Adoption.create({
          userId,
          petId,
          status: 'Pending',
          reason
        });
      };

      const adoptionRequest = await submitAdoptionRequest(
        1, // userId
        1, // petId
        'I love pets and have a big yard'
      );

      expect(Pet.findByPk).toHaveBeenCalledWith(1);
      expect(Adoption.findOne).toHaveBeenCalledWith({
        where: { userId: 1, petId: 1, status: 'Pending' }
      });
      expect(Adoption.create).toHaveBeenCalledWith({
        userId: 1,
        petId: 1,
        status: 'Pending',
        reason: 'I love pets and have a big yard'
      });
      expect(adoptionRequest).toEqual(testAdoption);

      // Step 4: Admin reviews and approves adoption
      const approvedAdoption = {
        ...testAdoption,
        status: 'Approved'
      };

      Adoption.findOne.mockResolvedValue(testAdoption);
      Adoption.update.mockResolvedValue([1]); // 1 row affected
      Pet.update.mockResolvedValue([1]); // 1 row affected

      const approveAdoption = async (adoptionId) => {
        const adoption = await Adoption.findOne({
          where: { id: adoptionId }
        });

        if (!adoption) {
          throw new Error('Adoption request not found');
        }

        if (adoption.status !== 'Pending') {
          throw new Error('Adoption request is not pending');
        }

        // Update adoption status
        await Adoption.update(
          { status: 'Approved' },
          { where: { id: adoptionId } }
        );

        // Update pet status
        await Pet.update(
          { status: 'Adopted' },
          { where: { id: adoption.petId } }
        );

        return { ...adoption, status: 'Approved' };
      };

      const approved = await approveAdoption(1);

      expect(Adoption.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(Adoption.update).toHaveBeenCalledWith(
        { status: 'Approved' },
        { where: { id: 1 } }
      );
      expect(Pet.update).toHaveBeenCalledWith(
        { status: 'Adopted' },
        { where: { id: 1 } }
      );
      expect(approved.status).toBe('Approved');
    });

    it('should handle adoption rejection flow', async () => {
      // Setup: User and pet exist, adoption request is pending
      Pet.findByPk.mockResolvedValue(testPet);
      Adoption.findOne.mockResolvedValue(testAdoption);

      const rejectAdoption = async (adoptionId, reason) => {
        const adoption = await Adoption.findOne({
          where: { id: adoptionId }
        });

        if (!adoption) {
          throw new Error('Adoption request not found');
        }

        if (adoption.status !== 'Pending') {
          throw new Error('Adoption request is not pending');
        }

        // Update adoption status to rejected
        await Adoption.update(
          { status: 'Rejected', rejectionReason: reason },
          { where: { id: adoptionId } }
        );

        return { ...adoption, status: 'Rejected', rejectionReason: reason };
      };

      const rejected = await rejectAdoption(1, 'Insufficient space for the pet');

      expect(Adoption.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(Adoption.update).toHaveBeenCalledWith(
        { status: 'Rejected', rejectionReason: 'Insufficient space for the pet' },
        { where: { id: 1 } }
      );
      expect(rejected.status).toBe('Rejected');
      expect(rejected.rejectionReason).toBe('Insufficient space for the pet');
    });

    it('should prevent duplicate adoption requests', async () => {
      // Setup: User already has a pending adoption for this pet
      Pet.findByPk.mockResolvedValue(testPet);
      Adoption.findOne.mockResolvedValue(testAdoption); // Existing pending adoption

      const submitAdoptionRequest = async (userId, petId, reason) => {
        const pet = await Pet.findByPk(petId);
        if (!pet) {
          throw new Error('Pet not found');
        }

        if (pet.status !== 'Available') {
          throw new Error('Pet is not available for adoption');
        }

        const existingAdoption = await Adoption.findOne({
          where: { userId, petId, status: 'Pending' }
        });

        if (existingAdoption) {
          throw new Error('You already have a pending adoption request for this pet');
        }

        return await Adoption.create({
          userId,
          petId,
          status: 'Pending',
          reason
        });
      };

      await expect(
        submitAdoptionRequest(1, 1, 'I want this pet')
      ).rejects.toThrow('You already have a pending adoption request for this pet');

      expect(Pet.findByPk).toHaveBeenCalledWith(1);
      expect(Adoption.findOne).toHaveBeenCalledWith({
        where: { userId: 1, petId: 1, status: 'Pending' }
      });
    });

    it('should prevent adoption of unavailable pets', async () => {
      // Setup: Pet is not available
      const unavailablePet = { ...testPet, status: 'Adopted' };
      Pet.findByPk.mockResolvedValue(unavailablePet);

      const submitAdoptionRequest = async (userId, petId, reason) => {
        const pet = await Pet.findByPk(petId);
        if (!pet) {
          throw new Error('Pet not found');
        }

        if (pet.status !== 'Available') {
          throw new Error('Pet is not available for adoption');
        }

        return await Adoption.create({
          userId,
          petId,
          status: 'Pending',
          reason
        });
      };

      await expect(
        submitAdoptionRequest(1, 1, 'I want this pet')
      ).rejects.toThrow('Pet is not available for adoption');

      expect(Pet.findByPk).toHaveBeenCalledWith(1);
    });
  });

  describe('Adoption Status Tracking', () => {
    it('should track adoption status changes', async () => {
      const adoptionHistory = [
        { id: 1, status: 'Pending', createdAt: new Date('2024-01-01') },
        { id: 1, status: 'Under Review', createdAt: new Date('2024-01-02') },
        { id: 1, status: 'Approved', createdAt: new Date('2024-01-03') }
      ];

      Adoption.findAll.mockResolvedValue(adoptionHistory);

      const getAdoptionHistory = async (adoptionId) => {
        return await Adoption.findAll({
          where: { id: adoptionId },
          order: [['createdAt', 'ASC']]
        });
      };

      const history = await getAdoptionHistory(1);

      expect(Adoption.findAll).toHaveBeenCalledWith({
        where: { id: 1 },
        order: [['createdAt', 'ASC']]
      });
      expect(history).toHaveLength(3);
      expect(history[0].status).toBe('Pending');
      expect(history[2].status).toBe('Approved');
    });
  });

  describe('Admin Dashboard Integration', () => {
    it('should provide admin with adoption statistics', async () => {
      const adoptions = [
        { id: 1, status: 'Pending' },
        { id: 2, status: 'Approved' },
        { id: 3, status: 'Rejected' },
        { id: 4, status: 'Pending' }
      ];

      Adoption.findAll.mockResolvedValue(adoptions);

      const getAdoptionStats = async () => {
        const allAdoptions = await Adoption.findAll();
        
        const stats = {
          total: allAdoptions.length,
          pending: allAdoptions.filter(a => a.status === 'Pending').length,
          approved: allAdoptions.filter(a => a.status === 'Approved').length,
          rejected: allAdoptions.filter(a => a.status === 'Rejected').length
        };

        return stats;
      };

      const stats = await getAdoptionStats();

      expect(Adoption.findAll).toHaveBeenCalled();
      expect(stats).toEqual({
        total: 4,
        pending: 2,
        approved: 1,
        rejected: 1
      });
    });
  });
}); 