import { User } from '../../models/index.js'
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import { Pet } from '../../models/index.js';
import { sequelize } from '../../database/index.js';
import { Adoption } from '../../models/adoption/Adoption.js';

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
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const userData = user.toJSON();
    
    const response = {
      id: userData.id,
      username: userData.username,
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update current user info
const updateMe = async (req, res) => {
  console.log("=== updateMe called ===");
  console.log("req.body:", req.body);
  console.log("req.user:", req.user);
  
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors.array() 
    });
  }
  
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const userId = req.user.id;
    const { email, firstName, lastName, phone, address, deleteImage, first_name, last_name, location } = req.body;
    
    // Handle both camelCase and snake_case field names
    const firstNameValue = firstName || first_name;
    const lastNameValue = lastName || last_name;
    
    console.log("Processing update with:", {
      userId,
      email,
      firstName: firstNameValue,
      lastName: lastNameValue,
      phone,
      address,
      location
    });
    
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate required fields
    if (!firstNameValue || !lastNameValue || !email) {
      return res.status(400).json({ message: "First name, last name, and email are required." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    user.email = email;
    user.firstName = firstNameValue;
    user.lastName = lastNameValue;
    user.phone = phone || null;
    user.address = address || null;
    user.location = location || null;

    // Handle image upload
    if (req.file) {
      // Remove old image if exists
      if (user.image_path && fs.existsSync(path.join('uploads', user.image_path))) {
        fs.unlinkSync(path.join('uploads', user.image_path));
      }
      // Store only the filename, not the full path
      user.image_path = req.file.filename;
    } else if (deleteImage === 'true' || deleteImage === true) {
      if (user.image_path && fs.existsSync(path.join('uploads', user.image_path))) {
        fs.unlinkSync(path.join('uploads', user.image_path));
      }
      user.image_path = null;
    }

    await user.save();
    console.log("User saved successfully");
    
    const { password, ...userData } = user.toJSON();
    console.log("Sending response:", { message: "Profile updated successfully", user: userData });
    res.json({ message: "Profile updated successfully", user: userData });
  } catch (err) {
    console.error("updateMe error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/user/profile - Get current user's profile and adopted pets
const getProfile = async (req, res) => {
  try {
    console.log("=== getProfile called ===");
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user?.id);
    console.log("req.user.email:", req.user?.email);
    console.log("req.user.role:", req.user?.role);
    
    if (!req.user) {
      console.log("No user in request, returning 401");
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user.id;
    console.log("Looking for user with ID:", userId);
    
    // Test database connection first
    try {
      await sequelize.authenticate();
      console.log("Database connection is working");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    // Fetch user profile
    console.log("Executing User.findByPk with ID:", userId);
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"]
      }
    });
    
    console.log("User query result:", user ? "User found" : "User not found");
    if (user) {
      console.log("User data:", {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
    
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("User found:", user.toJSON());
    
    // Fetch adopted pets for this user (status APPROVED or Adopted, case-insensitive)
    const adoptedAdoptions = await Adoption.findAll({
      where: {
        user_id: userId,
        status: {
          [Op.or]: [
            { [Op.iLike]: 'adopted' },
            { [Op.iLike]: 'approved' }
          ]
        }
      },
      include: [{ model: Pet }]
    });
    const adoptedPets = adoptedAdoptions.map(adoption => adoption.Pet).filter(Boolean);
    console.log('adoptedAdoptions:', adoptedAdoptions);
    console.log('adoptedPets:', adoptedPets);
    
    // Prepare response
    const userData = user.toJSON();
    const response = {
      profile: {
        id: userData.id,
        username: userData.username,
        first_name: userData.firstName ?? userData.first_name ?? "",
        last_name: userData.lastName ?? userData.last_name ?? "",
        email: userData.email,
        phone: userData.phone ?? userData.phone_number ?? "",
        location: userData.location ?? "",
        address: userData.address ?? "",
        image_path: userData.image_path ?? "",
        role: userData.role,
        created_at: userData.created_at,
      },
      adoptedPets
    };
    
    console.log("Sending response:", response);
    res.json(response);
  } catch (err) {
    console.error("getProfile error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};


export { getAll, getById, deleteById, update, getMe, updateMe, getProfile };