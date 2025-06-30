import { User } from '../../models/index.js';
import { Pet } from '../../models/index.js';

// Get all of a user's favorite pets
const getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: { model: Pet, through: { attributes: [] } } // Exclude join table attributes
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ data: user.Pets });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

// Add a pet to a user's favorites
const addFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const pet = await Pet.findByPk(req.params.petId);
    if (!user || !pet) return res.status(404).json({ message: 'User or Pet not found' });
    await user.addPet(pet);
    res.status(200).json({ message: 'Pet added to favorites' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

// Remove a pet from a user's favorites
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const pet = await Pet.findByPk(req.params.petId);
    if (!user || !pet) return res.status(404).json({ message: 'User or Pet not found' });
    await user.removePet(pet);
    res.status(200).json({ message: 'Pet removed from favorites' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};

export const favoriteController = { getFavorites, addFavorite, removeFavorite }; 