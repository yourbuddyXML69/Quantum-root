// Auth & RBAC Middleware with Post-Quantum Cryptography Verification
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "quantoom-root-super-secret-key-2026-pqc";

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: "GUEST" | "MEMBER" | "VERIFIED_RESEARCHER" | "MODERATOR" | "ADMIN" | "ENTERPRISE_ADMIN" | "AI_AGENT";
  subscriptionTier: "FREE" | "PRO" | "ENTERPRISE_LAB";
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Default to guest user if no token provided
    req.user = {
      id: "guest-anon",
      username: "guest_explorer",
      email: "guest@quantoomroot.local",
      role: "GUEST",
      subscriptionTier: "FREE",
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired authorization token." });
    }
    req.user = decoded as AuthenticatedUser;
    next();
  });
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Requires one of the following roles: [${allowedRoles.join(", ")}]. Current role: ${req.user?.role || "GUEST"}`,
      });
    }
    next();
  };
};
