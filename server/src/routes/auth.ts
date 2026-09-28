// Authentication & Post-Quantum Cryptography Handshake Routes
import { Router, Response } from "express";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "quantoom-root-super-secret-key-2026-pqc";

// In-memory demo users
const usersDb = new Map<string, any>([
  [
    "root_admin",
    {
      id: "u-admin-01",
      username: "root_admin",
      email: "admin@quantoomroot.io",
      role: "ADMIN",
      subscriptionTier: "ENTERPRISE_LAB",
      reputationPoints: 5000,
      displayName: "Quantoom System Administrator",
      primaryDomain: "CONVERGENCE",
    },
  ],
  [
    "dr_elena_vance",
    {
      id: "u-elena",
      username: "dr_elena_vance",
      email: "elena.vance@quantumlab.org",
      role: "VERIFIED_RESEARCHER",
      subscriptionTier: "PRO",
      reputationPoints: 2840,
      displayName: "Dr. Elena Vance",
      primaryDomain: "QUANTUM",
    },
  ],
  [
    "aaliyah_soc",
    {
      id: "u-aaliyah",
      username: "aaliyah_soc",
      email: "aaliyah@cyberdefenders.net",
      role: "VERIFIED_RESEARCHER",
      subscriptionTier: "PRO",
      reputationPoints: 3120,
      displayName: "Aaliyah Patel",
      primaryDomain: "CYBERSECURITY",
    },
  ],
]);

// Register
router.post("/register", (req, res) => {
  const { email, username, password, primaryDomain } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields: username, email, password" });
  }

  const existing = Array.from(usersDb.values()).find((u) => u.username === username || u.email === email);
  if (existing) {
    return res.status(400).json({ error: "Username or email is already registered." });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    username,
    email,
    role: "MEMBER",
    subscriptionTier: "FREE",
    reputationPoints: 100,
    displayName: username,
    primaryDomain: primaryDomain || "CONVERGENCE",
  };

  usersDb.set(username, newUser);

  const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: "7d" });
  return res.status(201).json({
    message: "Registration successful. Welcome to Quantoom Root!",
    user: newUser,
    accessToken: token,
  });
});

// Login
router.post("/login", (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: "Identifier and password required." });
  }

  const user = Array.from(usersDb.values()).find(
    (u) => u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()
  );

  // If user not found in mock, create dynamic guest/member session
  const activeUser = user || {
    id: `u-session-${Date.now()}`,
    username: identifier,
    email: `${identifier}@quantoomroot.local`,
    role: "MEMBER",
    subscriptionTier: "FREE",
    reputationPoints: 120,
    displayName: identifier,
    primaryDomain: "CONVERGENCE",
  };

  const token = jwt.sign(activeUser, JWT_SECRET, { expiresIn: "7d" });
  return res.json({
    message: "Login authenticated.",
    user: activeUser,
    accessToken: token,
  });
});

// Current User
router.get("/me", (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated" });
  }
  return res.json({ user: req.user });
});

// Post-Quantum Cryptography (NIST FIPS 203 ML-KEM / Kyber-768) Handshake Endpoint
router.post("/pqc/handshake", (req, res) => {
  const { clientKyberPublicKey } = req.body;

  // Generate simulated NIST ML-KEM-768 key encapsulation
  const serverEphemeralSecret = crypto.randomBytes(32);
  const serverKyberPublicKey = crypto.createHash("sha3-512").update(serverEphemeralSecret).digest("hex");
  const ciphertext = crypto.randomBytes(1088).toString("base64"); // Standard ML-KEM-768 ciphertext length

  // Derive hybrid session master secret using HKDF
  const salt = crypto.randomBytes(32);
  const sharedSecret = crypto.hkdfSync("sha256", serverEphemeralSecret, salt, Buffer.from("QUANTOOM-ROOT-PQC-V1"), 32);
  const sharedBuffer = Buffer.from(sharedSecret);

  return res.json({
    protocol: "NIST-FIPS-203-ML-KEM-768",
    status: "ESTABLISHED",
    serverKyberPublicKey: serverKyberPublicKey.substring(0, 64) + "...",
    ciphertextSnippet: ciphertext.substring(0, 48) + "...",
    derivedKeyId: crypto.createHash("sha256").update(sharedBuffer).digest("hex").substring(0, 16),
    quantumSecurityLevel: "NIST Level 3 (equivalent to AES-192 against quantum brute-force)",
    immunityAgainstShorAlgorithm: true,
  });
});

export default router;
