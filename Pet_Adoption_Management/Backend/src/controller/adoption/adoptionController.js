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

    // Check if user already has a pending adoption for this pet
    const existingAdoption = await Adoption.findOne({
      where: { user_id, pet_id, status: 'pending' }
    });

    if (existingAdoption) {
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

// GET /api/adoptions (for logged-in user)
const getAllForUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const adoptions = await Adoption.findAll({
      where: { user_id },
      include: [
        { 
          model: Pet,
          attributes: ['id', 'name', 'breed', 'type', 'age', 'image_path']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ data: adoptions });
  } catch (e) {
    console.error('Error fetching user adoptions:', e);
    res.status(500).json({ message: 'Failed to fetch your adoption requests' });
  }
};

// GET /api/adoptions/admin (admin only)
const getAllForAdmin = async (req, res) => {
  try {
    const adoptions = await Adoption.findAll({
      include: [
        { 
          model: User,
          attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'image_path']
        },
        { 
          model: Pet,
          attributes: ['id', 'name', 'breed', 'type', 'age', 'image_path']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ data: adoptions });
  } catch (e) {
    console.error('Error fetching admin adoptions:', e);
    res.status(500).json({ message: 'Failed to fetch adoptions' });
  }
};

// PATCH /api/adoptions/:id/approve (admin only)
const approve = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption not found' });
    }
    
    adoption.status = 'approved';
    await adoption.save();
    
    res.json({ 
      message: 'Adoption approved successfully', 
      data: adoption 
    });
  } catch (e) {
    console.error('Error approving adoption:', e);
    res.status(500).json({ message: 'Failed to approve adoption' });
  }
};

// PATCH /api/adoptions/:id/reject (admin only)
const reject = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption not found' });
    }
    
    adoption.status = 'rejected';
    await adoption.save();
    
    res.json({ 
      message: 'Adoption rejected successfully', 
      data: adoption 
    });
  } catch (e) {
    console.error('Error rejecting adoption:', e);
    res.status(500).json({ message: 'Failed to reject adoption' });
  }
};

export const adoptionController = { create, getAllForUser, getAllForAdmin, approve, reject }; 