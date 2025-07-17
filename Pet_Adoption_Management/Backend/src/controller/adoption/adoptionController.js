import { Adoptions } from '../../models/adoption/Adoptions.js';
import { AdoptBy } from '../../models/adoption/AdoptBy.js';
import { Pet } from '../../models/pet/Pet.js';
import { User } from '../../models/user/User.js';
import { Op } from 'sequelize';

// POST /api/adoptions
const create = async (req, res) => {
  try {
    const { pet_id, user_id, full_name, address, phone, reason } = req.body;
    // Insert adopter details
    const adopter = await AdoptBy.create({ user_id, full_name, address, phone, reason });
    // Create adoption record
    const adoption = await Adoptions.create({ pet_id, adopter_id: adopter.id, status: 'pending' });
    res.status(201).json({ message: 'Adoption request submitted', adoption });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create adoption' });
  }
};

// GET /api/adoptions (for logged-in user)
const getAllForUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    // Find all adoptions where adopter.user_id = current user
    const adoptions = await Adoptions.findAll({
      include: [
        { model: AdoptBy, where: { user_id } },
        { model: Pet }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ data: adoptions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch your adoption requests' });
  }
};

// PATCH /api/adoptions/:id/approve (admin only)
const approve = async (req, res) => {
  try {
    const adoption = await Adoptions.findByPk(req.params.id);
    if (!adoption) return res.status(404).json({ message: 'Adoption not found' });
    adoption.status = 'approved';
    await adoption.save();
    res.json({ message: 'Adoption approved', adoption });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to approve adoption' });
  }
};

// Optionally, keep or update getAll, getById, update, deleteById for admin use

export const adoptionController = { create, getAllForUser, approve }; 