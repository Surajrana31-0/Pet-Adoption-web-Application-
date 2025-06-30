import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// if (process.env.JWT_SECRET) {
//     // Generate a JWT token with the provided payload and expiration time
//     // The secret key is taken from environment variables
//     // The token will expire based on the value of process.env.expireIn
const generateToken = (payload) => {
    const options = {
        expiresIn : process.env.expireIn,
    }
    return jwt.sign(payload, process.env.secretKey, options);
};
export { generateToken  };
