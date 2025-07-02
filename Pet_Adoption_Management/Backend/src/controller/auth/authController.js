import { User } from "../../models/user/User.js";
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role: "user" });
        const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
        return res.status(201).json({
            data: { access_token: token },
            message: "Signup successful",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        if (req.body.email == null) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (req.body.password == null) {
            return res.status(400).json({ message: "Password is required" });
        }
        const foundUser = await User.findOne({ where: { email: req.body.email } });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = generateToken({ id: foundUser.id, email: foundUser.email, role: foundUser.role });
        return res.status(200).send({
            data: { access_token: token },
            message: "Login successful",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { login, signup };