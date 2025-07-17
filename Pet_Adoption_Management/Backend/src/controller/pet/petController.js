import { Pet } from '../../models/pet/Pet.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

const getAll = async (req, res) => {
  try {
    const pets = await Pet.findAll({ order: [['created_at', 'DESC']] });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, breed, type, age, description, status } = req.body;
    const image_path = req.file ? req.file.path : null;
    const pet = await Pet.create({
      name,
      breed,
      type,
      age,
      description,
      image_path,
      status
    });
    res.status(201).json({ data: pet });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create pet' });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    const { name, breed, type, age, description, status } = req.body;
    let image_path = pet.image_path;
    if (req.file) {
      // Delete old image if exists
      if (image_path && fs.existsSync(image_path)) {
        fs.unlinkSync(image_path);
      }
      image_path = req.file.path;
    }
    await pet.update({ name, breed, type, age, description, status, image_path });
    res.status(200).json({ data: pet });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update pet' });
  }
};

const deleteById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    // Delete image file if exists
    if (pet.image_path && fs.existsSync(pet.image_path)) {
      fs.unlinkSync(pet.image_path);
    }
    await pet.destroy();
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete pet' });
  }
};

export const petController = { getAll, getById, create, update, deleteById }; 