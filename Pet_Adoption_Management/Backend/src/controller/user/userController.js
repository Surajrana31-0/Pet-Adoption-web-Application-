import { User } from '../../models/index.js'


/**
 *  fetch all users
 */
const getAll = async (req, res) => {
    try {
        //fetching all the data from users table
        const users = await User.findAll();
        res.status(200).send({ data: users, message: "successfully fetched data" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/** 
 *  create new user
*/

const create = async (req, res) => {

    try {
        const body = req.body
        console.log(req.body)
        //validation
        if (!body?.email || !body?.username || !body?.password || !body?.firstName || !body?.lastName || !body?.phone || !body?.location || !body?.address || body?.agreeToTerms !== true)
            return res.status(500).send({ message: "Invalid payload: all fields required and terms must be agreed to." });
        const users = await User.create({
            username: body.username,
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            location: body.location,
            address: body.address,
            agreeToTerms: body.agreeToTerms
        });
        res.status(201).send({ data: users, message: "successfully created user" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 *  update existing user
 */

const update = async (req, res) => {

    try {
        const { id = null } = req.params;
        const body = req.body;
        console.log(req.params)
        //checking if user exist or not
        const oldUser = await User.findOne({ where: { id } })
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.username = body.username;
        oldUser.password = body.password || oldUser.password;
        oldUser.email = body.email;
        oldUser.firstName = body.firstName;
        oldUser.lastName = body.lastName;
        oldUser.phone = body.phone;
        oldUser.location = body.location;
        oldUser.address = body.address;
        oldUser.agreeToTerms = body.agreeToTerms;
        oldUser.save();
        res.status(201).send({ data: oldUser, message: "user updated successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to update users' });
    }
}

/**
 *  delete user 
 */
const delelteById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const oldUser = await User.findOne({ where: { id } })

        //checking if user exist or not
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.destroy();
        res.status(201).send({ message: "user deleted successfully" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
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
            return res.status(500).send({ message: "User not found" });
        }
        res.status(201).send({ message: "user fetched successfully", data: user })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
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
    create,
    getById,
    delelteById,
    update
}