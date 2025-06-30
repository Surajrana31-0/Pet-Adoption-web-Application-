import { Pet } from '../../models/pet/Pet.js';

const getAll = async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.status(200).json({ data: pets });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch pets' });
  }
};

const getById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json({ data: pet });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch pet' });
  }
};

const create = async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ data: pet });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create pet' });
  }
};

const update = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    await pet.update(req.body);
    res.status(200).json({ data: pet });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update pet' });
  }
};

const deleteById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    await pet.destroy();
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete pet' });
  }
};

export const petController = { getAll, getById, create, update, deleteById }; 