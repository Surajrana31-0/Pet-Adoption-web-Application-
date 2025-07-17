import { User } from "../models/user/User.js";
import { Pet } from "../models/pet/Pet.js";
import { Adoption } from "../models/adoption/Adoption.js";

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.count();
    const pets = await Pet.count();
    const adoptions = await Adoption.count();
    res.json({ users, pets, adoptions });
  } catch (err) {
    console.error("getAdminStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
}; 