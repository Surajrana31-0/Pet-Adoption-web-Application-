import { Adoption } from '../../models/adoption/Adoption.js';
import { Pet } from '../../models/pet/Pet.js';
import { User } from '../../models/user/User.js';
import { validationResult } from 'express-validator';

// POST /api/adoptions
const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      pet_id,
      adopter_name,
      adopter_email,
      adopter_phone,
      adopter_address,
      adoption_reason,
      experience_with_pets,
      living_situation,
      other_pets,
      children,
      work_schedule
    } = req.body;

    const user_id = req.user.id;

    // Verify pet exists
    const pet = await Pet.findByPk(pet_id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Prevent adoption if pet is already adopted or pending
    if (["Adopted", "Pending"].includes(pet.status)) {
      return res.status(400).json({ message: 'This pet is already adopted or pending adoption' });
    }

    // Prevent adoption if any adoption record for this pet is pending or approved/adopted
    const existingAdoption = await Adoption.findOne({
      where: {
        pet_id,
        status: ["pending", "APPROVED", "Adopted", "Pending"]
      }
    });
    if (existingAdoption) {
      return res.status(400).json({ message: 'This pet is already adopted or pending adoption' });
    }

    // Check if user already has a pending adoption for this pet
    const userPendingAdoption = await Adoption.findOne({
      where: { user_id, pet_id, status: 'pending' }
    });
    if (userPendingAdoption) {
      return res.status(400).json({ message: 'You already have a pending adoption request for this pet' });
    }

    // Create adoption record
    const adoption = await Adoption.create({
      user_id,
      pet_id,
      adopter_name,
      adopter_email,
      adopter_phone,
      adopter_address,
      adoption_reason,
      experience_with_pets,
      living_situation,
      other_pets,
      children,
      work_schedule,
      status: 'pending'
    });

    res.status(201).json({ 
      message: 'Adoption request submitted successfully', 
      data: adoption 
    });
  } catch (e) {
    console.error('Error creating adoption:', e);
    res.status(500).json({ message: 'Failed to create adoption request' });
  }
};

// GET /api/adoptions (all for admin, or user-specific for adopter)
const getAll = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const where = isAdmin ? {} : { user_id: req.user.id };
    const adoptions = await Adoption.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'image_path'] },
        { model: Pet, attributes: ['id', 'name', 'breed', 'type', 'age', 'image_path'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ data: adoptions });
  } catch (e) {
    console.error('Error fetching adoptions:', e);
    res.status(500).json({ message: 'Failed to fetch adoptions' });
  }
};

// PUT /api/adoptions/:id/approve (admin only)
const approve = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption not found' });
    }
    adoption.status = 'APPROVED';
    await adoption.save();
    // Also update the pet's status to 'Adopted'
    const pet = await Pet.findByPk(adoption.pet_id);
    if (pet) {
      pet.status = 'Adopted';
      await pet.save();
    }
    res.json({ message: 'Adoption approved', data: adoption });
  } catch (e) {
    console.error('Error approving adoption:', e);
    res.status(500).json({ message: 'Failed to approve adoption' });
  }
};

// PUT /api/adoptions/:id/reject (admin only)
const reject = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption not found' });
    }
    adoption.status = 'REJECTED';
    await adoption.save();
    res.json({ message: 'Adoption rejected', data: adoption });
  } catch (e) {
    console.error('Error rejecting adoption:', e);
    res.status(500).json({ message: 'Failed to reject adoption' });
  }
};

export const adoptionController = { create, getAll, approve, reject }; 