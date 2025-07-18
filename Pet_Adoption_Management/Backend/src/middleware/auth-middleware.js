import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  console.log("requireAuth middleware called");
  const authHeader = req.header("Authorization");
  console.log("Authorization header:", authHeader);
  if (!authHeader) {
    console.log("No Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("JWT verified, decoded:", decoded);
    next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
} 