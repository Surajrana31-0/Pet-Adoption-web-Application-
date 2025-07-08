import { User } from "../../models/user/User.js";
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendResetEmail } from "../../utils/SendEmail.js";

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

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const token = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
            const expiry = Date.now() + 3600000; // 1 hour
            user.reset_token = hashedToken;
            user.reset_token_expiry = new Date(expiry);
            await user.save();
            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;
            await sendResetEmail(user.email, resetLink);
        }
        // Always respond with generic message
        return res.status(200).json({ message: "If an account exists for this email, a reset link has been sent." });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const confirmPasswordReset = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required" });
    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({ where: {
            reset_token: hashedToken,
            reset_token_expiry: { $gt: new Date() }
        }});
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });
        user.password = await bcrypt.hash(newPassword, 10);
        user.reset_token = null;
        user.reset_token_expiry = null;
        await user.save();
        return res.status(200).json({ message: "Password has been reset successfully." });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { login, signup, requestPasswordReset, confirmPasswordReset };