import { User } from '../../models/index.js'
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

/**
 *  fetch all users (with optional search)
 */
const getAll = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        if (search) {
            where = {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { firstName: { [Op.iLike]: `%${search}%` } },
                    { lastName: { [Op.iLike]: `%${search}%` } },
                ]
            };
        }
        const users = await User.findAll({ where });
        res.status(200).send({ data: users, message: "successfully fetched data" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 *  update existing user (role, image, etc)
 */
const update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { id = null } = req.params;
        const body = req.body;
        const oldUser = await User.findOne({ where: { id } })
        if (!oldUser) {
            return res.status(404).send({ message: "User not found" });
        }
        // Update role if provided
        if (body.role && ['user', 'admin'].includes(body.role)) {
            oldUser.role = body.role;
        }
        // Update other fields as needed
        oldUser.username = body.username ?? oldUser.username;
        oldUser.email = body.email ?? oldUser.email;
        oldUser.firstName = body.firstName ?? oldUser.firstName;
        oldUser.lastName = body.lastName ?? oldUser.lastName;
        oldUser.phone = body.phone ?? oldUser.phone;
        oldUser.location = body.location ?? oldUser.location;
        oldUser.address = body.address ?? oldUser.address;
        oldUser.agreeToTerms = body.agreeToTerms ?? oldUser.agreeToTerms;
        // Handle image upload
        if (req.file) {
            // Delete old image if exists
            if (oldUser.image_path && fs.existsSync(oldUser.image_path)) {
                fs.unlinkSync(oldUser.image_path);
            }
            oldUser.image_path = req.file.path;
        }
        await oldUser.save();
        res.status(200).send({ data: oldUser, message: "user updated successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to update user' });
    }
}

/**
 *  delete user (and image)
 */
const deleteById = async (req, res) => {
    try {
        const { id = null } = req.params;
        const oldUser = await User.findOne({ where: { id } })
        if (!oldUser) {
            return res.status(404).send({ message: "User not found" });
        }
        // Delete image file if exists
        if (oldUser.image_path && fs.existsSync(oldUser.image_path)) {
            fs.unlinkSync(oldUser.image_path);
        }
        await oldUser.destroy();
        res.status(200).send({ message: "user deleted successfully" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

/**
 *  fetch user by id
 */
const getById = async (req, res) => {
    try {
        const { id = null } = req.params;
        const user = await User.findOne({ where: { id } })
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "user fetched successfully", data: user })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}

// Get current user info
const getMe = async (req, res) => {
  console.log("=== ENTERED getMe CONTROLLER ===");
  console.log("getMe called, req.user:", req.user);
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const userId = req.user.id;
    console.log("Looking up user by id:", userId);
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userData = user.toJSON();
    console.log("userData from toJSON:", userData);
    const response = {
      id: userData.id,
      username: userData.username, // Added username
      first_name: userData.firstName ?? userData.first_name ?? "",
      last_name: userData.lastName ?? userData.last_name ?? "",
      email: userData.email,
      phone: userData.phone ?? userData.phone_number ?? "",
      location: userData.location ?? "",
      address: userData.address ?? "",
      image_path: userData.image_path ?? "",
      role: userData.role,
      created_at: userData.created_at,
    };
    res.json(response);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error", error: err.message, stack: err.stack });
  }
};

// Update current user info
const updateMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const userId = req.user.id;
    const { email, firstName, lastName, phone, location, address, deleteImage } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "First name, last name, and email are required." });
    }
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    user.address = address ?? user.address;
    // Handle image upload
    if (req.file) {
      if (user.image_path && fs.existsSync(user.image_path)) {
        fs.unlinkSync(user.image_path);
      }
      user.image_path = req.file.path;
    } else if (deleteImage === 'true' || deleteImage === true) {
      if (user.image_path && fs.existsSync(user.image_path)) {
        fs.unlinkSync(user.image_path);
      }
      user.image_path = null;
    }
    await user.save();
    // Exclude password from response
    const { password, ...userData } = user.toJSON();
    res.json({ message: "Profile updated", user: userData });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export { getAll, getById, deleteById, update, getMe, updateMe };