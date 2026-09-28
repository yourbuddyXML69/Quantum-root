// Quantoom Root - Unified Quantum + AI + Cybersecurity Community Platform
// Main Express API & Real-Time WebSocket Server
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";

import authRoutes from "./routes/auth";
import quantumRoutes from "./routes/quantum";
import aiRoutes from "./routes/ai";
import cyberRoutes from "./routes/cyber";
import communityRoutes from "./routes/community";
import { authenticateToken } from "./middleware/auth";
import { CyberRangeEngine } from "./cyber/cyberRange";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(authenticateToken);

// Health Check & Platform Metrics
app.get("/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    version: "1.0.0",
    service: "Quantoom Root Core API",
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    pqcEnabled: true,
  });
});

app.get("/api/v1/stats", (req, res) => {
  res.json({
    activeMembers: 14280,
    quantumCircuitsSimulated: 98450,
    aiQueriesProcessed: 312500,
    ctfChallengesSolved: 18400,
    activeConvergenceProjects: 42,
    pqcMigrationProgressPct: 78.4,
  });
});

// Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quantum", quantumRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/cyber", cyberRoutes);
app.use("/api/v1/community", communityRoutes);

// Serve client static build for unified production deployment
const clientDistPath = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/ws") || req.path === "/health") {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// -------------------------------------------------------------
// REAL-TIME WEBSOCKET TELEMETRY & SIEM BROADCASTER
// -------------------------------------------------------------
const wss = new WebSocketServer({ server, path: "/ws" });
const activeClients = new Set<WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  activeClients.add(ws);
  ws.send(
    JSON.stringify({
      type: "SYSTEM_CONNECTED",
      message: "Connected to Quantoom Root Real-Time Security & Telemetry Stream",
      pqcMode: "FIPS-203-HYBRID",
    })
  );

  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "PING") {
        ws.send(JSON.stringify({ type: "PONG", timestamp: Date.now() }));
      }
    } catch (e) {
      // Ignore invalid JSON
    }
  });

  ws.on("close", () => {
    activeClients.delete(ws);
  });
});

// Periodic simulated SIEM event broadcast to all active websockets
setInterval(() => {
  if (activeClients.size > 0) {
    const events = CyberRangeEngine.generateSampleSIEMEvents(1);
    const alert = events[0];
    const payload = JSON.stringify({
      type: "SIEM_ALERT",
      data: alert,
    });

    for (const client of activeClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }
}, 8000);

// Only listen if not loaded by a test runner
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` ⚛️  QUANTOOM ROOT CORE SERVER INITIALIZED`);
    console.log(` Tagline: "Root access to the quantum-AI-cyber frontier."`);
    console.log(` Port: ${PORT}`);
    console.log(` REST API: http://localhost:${PORT}/api/v1`);
    console.log(` WebSocket Stream: ws://localhost:${PORT}/ws`);
    console.log(` PQC Engine: NIST FIPS 203 ML-KEM & FIPS 204 ML-DSA Ready`);
    console.log(`=======================================================`);
  });
}

export { app, server };
