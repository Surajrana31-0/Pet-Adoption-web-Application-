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
const delelteById = async (req, res) => {
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
export const getMe = async (req, res) => {
  console.log("req.user:", req.user); // Debug line
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update current user info
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, username, firstName, lastName, phone, location, address } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.email = email ?? user.email;
    user.username = username ?? user.username;
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    user.address = address ?? user.address;
    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const userController = {
    getAll,
    getById,
    delelteById,
    update
};