import { user } from "../models/user.js";
import { generateToken } from "../utils/jwt.js";

const login = async (req, res) => {
    try {
        if (req.body.email == null) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (req.body.password == null) {
            return res.status(400).json({ message: "Password is required" });
        }
        const foundUser = await user.findOne({ where: { email: req.body.email } });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (foundUser.password !== req.body.password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = generateToken({ user: foundUser.toJSON() });
        return res.status(200).send({
            data: { access_token: token },
            message: "Login successful",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { login };