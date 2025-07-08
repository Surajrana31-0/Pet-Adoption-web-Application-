import { Adoption } from '../../models/adoption/Adoption.js';
import { Pet } from '../../models/pet/Pet.js';
import { User } from '../../models/user/User.js';

const getAll = async (req, res) => {
  try {
    const userId = req.user.id; // Decoded from JWT
    const adoptions = await Adoption.findAll({
      where: { UserId: userId },
      include: [User, Pet],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ data: adoptions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch adoption requests' });
  }
};

const getById = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id, { include: [User, Pet] });
    if (!adoption) return res.status(404).json({ message: 'Adoption not found' });
    res.status(200).json({ data: adoption });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch adoption' });
  }
};

const create = async (req, res) => {
  try {
    const adoption = await Adoption.create(req.body);
    res.status(201).json({ data: adoption });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create adoption' });
  }
};

const update = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) return res.status(404).json({ message: 'Adoption not found' });
    await adoption.update(req.body);
    res.status(200).json({ data: adoption });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update adoption' });
  }
};

const deleteById = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) return res.status(404).json({ message: 'Adoption not found' });
    await adoption.destroy();
    res.status(200).json({ message: 'Adoption deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete adoption' });
  }
};

const getAllForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const adoptions = await Adoption.findAll({
      where: { UserId: userId },
      include: [User, Pet],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ data: adoptions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch your adoption requests' });
  }
};

export const adoptionController = { getAll, getById, create, update, deleteById, getAllForUser }; 