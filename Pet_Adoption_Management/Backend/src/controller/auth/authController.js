import { User } from "../../models/user/User.js";
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendResetEmail } from "../../utils/SendEmail.js";

const signup = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, phone, location, address, agreeToTerms } = req.body;
        if (!username || !email || !password || !firstName || !lastName || !phone || !location || !address || agreeToTerms !== true) {
            return res.status(400).json({ message: "All fields are required and terms must be agreed to." });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            location,
            address,
            agreeToTerms,
            role: "user"
        });
        // Do NOT generate or return a JWT token here
        return res.status(201).json({
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
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ message: "Username and email are required" });
    }
    try {
        const user = await User.findOne({ where: { username, email } });
        if (user) {
            const rawToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
            user.reset_token = hashedToken;
            user.reset_token_expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await user.save();
            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/new-password?token=${encodeURIComponent(rawToken)}&username=${encodeURIComponent(username)}`;
            await sendResetEmail(user.email, resetLink, username);
        }
        // Always respond with generic message
        return res.status(200).json({ message: "If this user exists, a reset link has been sent to your email." });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const confirmPasswordReset = async (req, res) => {
    const { username, token, newPassword } = req.body;
    if (!username || !token || !newPassword) {
        return res.status(400).json({ message: "Username, token, and new password are required" });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.log("No user found for username:", username);
            return res.status(400).json({ message: "Invalid username or reset token" });
        }
        if (!user.reset_token || !user.reset_token_expiry) {
            console.log("No reset token or expiry set for user:", username);
            return res.status(400).json({ message: "No reset request found or token already used" });
        }
        if (user.reset_token !== hashedToken) {
            console.log("Token mismatch for user:", username, "Expected:", user.reset_token, "Got:", hashedToken);
            return res.status(400).json({ message: "Invalid reset token" });
        }
        if (user.reset_token_expiry < new Date()) {
            console.log("Token expired for user:", username, "Expiry:", user.reset_token_expiry, "Now:", new Date());
            return res.status(400).json({ message: "Reset token has expired" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.reset_token = null;
        user.reset_token_expiry = null;
        await user.save();
        console.log("Password reset successful for user:", username);
        return res.status(200).json({ message: "Password has been reset successfully. You can now log in with your new password." });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { login, signup, requestPasswordReset, confirmPasswordReset };