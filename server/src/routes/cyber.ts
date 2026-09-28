// Cybersecurity Range & CTF Routes
import { Router } from "express";
import { CyberRangeEngine } from "../cyber/cyberRange";
import { AuthRequest } from "../middleware/auth";

const router = Router();
const cyberRange = new CyberRangeEngine();

// Get all CTF challenges
router.get("/challenges", (req, res) => {
  const challenges = cyberRange.getChallenges();
  return res.json({ challenges });
});

// Submit CTF Flag
router.post("/challenges/:id/submit-flag", (req: AuthRequest, res) => {
  const { id } = req.params;
  const { flag } = req.body;

  if (!flag) {
    return res.status(400).json({ error: "Flag string is required." });
  }

  const userId = req.user?.id || "guest_explorer";
  const result = cyberRange.verifyFlag(userId, id, flag);

  if (result.isCorrect) {
    return res.json(result);
  } else {
    return res.status(400).json(result);
  }
});

// Stream / Get Live SIEM Events
router.get("/siem/events", (req, res) => {
  const limit = parseInt(req.query.limit as string) || 8;
  const events = CyberRangeEngine.generateSampleSIEMEvents(limit);
  return res.json({ events });
});

// Threat Intel & Vulnerability Feed
router.get("/threat-intel", (req, res) => {
  const advisories = CyberRangeEngine.getThreatIntelFeed();
  return res.json({ advisories });
});

export default router;
