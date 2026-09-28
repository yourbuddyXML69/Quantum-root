# Quantoom Root — Unified Quantum + AI + Cybersecurity Community Platform
> **Tagline:** *Root access to the quantum-AI-cyber frontier.*  
> **Version:** `1.0.0-PROD` | **License:** Apache-2.0

---

## 🌌 Overview

**Quantoom Root** is an all-in-one, production-grade community application uniting **Quantum Computing**, **Artificial Intelligence**, and **Defensive Cybersecurity**. It bridges historically siloed research ecosystems into a single, cohesive, quantum-aware, and AI-native platform designed for researchers, engineers, ethical hackers, and students worldwide.

```
       QUANTOOM ROOT ECOSYSTEM
      ┌───────────────────────────┐
      │   COMMUNITY & FEED HUB    │
      └─────────────┬─────────────┘
                    │
   ┌────────────────┼────────────────┐
   ▼                ▼                ▼
[ QUANTUM LAB ] [ AI COPILOT ] [ CYBER RANGE ]
State Simulator  RAG Engine     Ethical CTFs
Bloch Vectors    Code Review    SIEM Telemetry
OpenQASM 3.0     Model Router   MITRE ATT&CK
   │                │                │
   └────────────────┼────────────────┘
                    ▼
      ┌───────────────────────────┐
      │   CONVERGENCE PROJECTS    │
      │   & PQC HYBRID SECURITY   │
      └───────────────────────────┘
```

---

## ⚡ Core Feature Highlights

### 1. Quantum Computing Hub
- **Interactive Circuit Composer**: Drag-and-drop circuit matrix supporting single-qubit gates ($H, X, Y, Z, S, T, R_x, R_y, R_z$) and multi-qubit entangling gates ($\text{CNOT}, \text{CZ}, \text{SWAP}, \text{Toffoli}$).
- **Exact State-Vector Simulation**: Real-time complex amplitude evolution and Monte Carlo projective measurement histogram sampling.
- **Bloch Sphere Coordinates**: Automatic partial-trace density matrix extraction calculating Bloch vectors $(\theta, \phi)$ and $(x, y, z)$ projections for each qubit.
- **OpenQASM 3.0 Transpiler**: Instant conversion and code generation for Qiskit, Cirq, and PennyLane.
- **Algorithm Library**: Pre-built, executable templates for Bell States, Grover's 2-Qubit Search ($|11\rangle$), 3-Qubit Quantum Teleportation, 3-Qubit Quantum Fourier Transform (QFT), and Post-Quantum Lattice simulations.
- **Hardware Dispatcher**: Integration readiness for IBM Quantum Heron (133-qubit), AWS Braket Rigetti, and Azure Quantum IonQ.

### 2. AI Copilot & Knowledge Engine
- **RAG-Powered Research Assistant**: Dense literature search indexed over NIST standards, arXiv quantum pre-prints, and MITRE vulnerability corpora.
- **Multi-Model Routing**: Dynamic selection between OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro, and local air-gapped Ollama microVMs.
- **Static Security Code Reviewer**: Automated AST heuristic analyzer detecting OWASP Top 10 vulnerabilities, insecure cryptographic primitives, and Shor-vulnerable classical algorithms (RSA, ECC), with automated migration recommendations to NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA).
- **Research Paper Summarizer**: Automated structural extraction of hypotheses, equations, and citations from arXiv research texts.
- **Safety Guardrails**: Proactive jailbreak and prompt-injection filtering.

### 3. Cybersecurity Range & SOC Operations
- **Jeopardy-Style Sandboxed CTFs**: Categories include Post-Quantum Cryptography, Forensics & QKD Telemetry, AI Red Teaming, Web Security, and Binary Reverse Engineering.
- **Constant-Time Flag Validator**: Cryptographically secure verification (`crypto.timingSafeEqual`) preventing timing side-channel attacks.
- **Live SIEM Dashboard**: Streaming real-time Suricata and Zeek security events with color-coded severity and mapped MITRE ATT&CK technique tags (e.g., `T1588.006` Harvest-Now-Decrypt-Later, `T1059.006` Python Execution, `T1110.001` Brute Force).
- **Threat Intel & CVE Radar**: Real-world quantum security advisories and post-quantum migration alerts.

### 4. Community Hub & Convergence Projects
- **Domain Feeds**: Tagged discussions across `/quantum`, `/ai`, `/cyber`, and `/convergence`.
- **Q&A System**: Upvoting, verified accepted answers, and author reputation tracking.
- **Gamified Reputation**: Tiered ladder with badges (*Quantum Supremacist*, *Lattice Guardian*, *Convergence Pioneer*).
- **Convergence Projects**: Cross-disciplinary hackathons and bounties with milestone trackers and GitHub repository integration.
- **Post-Quantum Cryptography Handshake**: Interactive inspector demonstrating NIST FIPS 203 ML-KEM-768 key encapsulation handshakes.

---

## 🛠️ Repository & Architecture Structure

```
QUANTUM ROOT APP/
├── docs/
│   ├── PRD.md                     # Product Requirements Document
│   ├── ARCHITECTURE.md            # System architecture with Mermaid diagrams
│   ├── API_SPECIFICATION.md       # API protocol & endpoint documentation
│   ├── OPENAPI.yaml               # OpenAPI 3.1 specification
│   ├── GRAPHQL_SCHEMA.graphql     # Complete GraphQL schema
│   ├── SECURITY_AND_COMPLIANCE.md # OWASP, Zero-Trust, NIST PQC compliance
│   ├── ROADMAP.md                 # Product roadmap & phased delivery
│   └── ASSUMPTIONS.md             # Engineering baselines and assumptions
├── prisma/
│   └── schema.prisma              # 25+ normalized relational models
├── server/                        # Backend API & Execution Microservices
│   ├── src/
│   │   ├── quantum/simulator.ts   # Complex math, gates, Bloch sphere & QASM
│   │   ├── ai/ragEngine.ts        # Vector RAG, AST code reviewer, model router
│   │   ├── cyber/cyberRange.ts    # Sandboxed CTF runner, constant-time flags, SIEM
│   │   ├── community/             # Feed, posts, Q&A, and leaderboard service
│   │   ├── middleware/auth.ts     # JWT, RBAC & PQC verification middleware
│   │   ├── routes/                # REST endpoint routers (auth, quantum, ai, cyber, community)
│   │   ├── test-runner.ts         # Automated test suite (30 assertions)
│   │   └── index.ts               # Express & WebSocket entrypoint
│   └── package.json
├── client/                        # Frontend Web Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── quantum/           # Interactive Circuit Composer & Bloch spheres
│   │   │   ├── ai/                # AI Copilot chat, AST reviewer, paper summarizer
│   │   │   ├── cyber/             # CTF challenges & live SIEM event monitor
│   │   │   ├── community/         # Domain feed, new post modal, leaderboard
│   │   │   └── layout/Navbar.tsx  # Sticky header & PQC status trigger
│   │   ├── lib/api.ts             # API client bindings
│   │   ├── App.tsx                # Master workspace layout
│   │   └── main.tsx
│   └── package.json
├── kubernetes/                    # K8s Deployment, Service & Ingress manifests
├── .github/workflows/             # GitHub Actions CI/CD & Security SAST pipelines
├── docker-compose.yml             # Full-stack container orchestration
├── Dockerfile.server              # Multi-stage production container for server
├── Dockerfile.client              # Multi-stage production container for client (Nginx)
└── package.json                   # Root monorepo scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `10+` or `11+`
- Git

### 1. Run Automated Test Suite
Verify that all quantum simulation math, AST security scanners, and CTF flag verification tests pass:
```bash
npm test
```
*Expected Result: 30 Passed, 0 Failed.*

### 2. Run Locally in Development Mode

**Terminal 1 — Backend API & WebSockets:**
```bash
cd server
npm run dev
```
*Server will launch at `http://localhost:4000` with WebSocket stream at `ws://localhost:4000/ws`.*

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
```
*Client will launch at `http://localhost:3000` with live proxying to the backend.*

---

## 🐳 Docker Deployment

To launch the complete multi-service stack (Server, Client, PostgreSQL 16 with pgvector, and Redis) using Docker Compose:

```bash
docker-compose up --build
```
- Web Application: `http://localhost:3000`
- REST API & Health: `http://localhost:4000/health`
- WebSocket Telemetry: `ws://localhost:4000/ws`

---

## ☸️ Kubernetes Deployment

Deploy into your production Kubernetes cluster:
```bash
kubectl create namespace quantoom-root
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

---

## 🔐 Security & Post-Quantum Cryptography Compliance
Quantoom Root implements defense-in-depth:
- **NIST FIPS 203 (ML-KEM)**: Module-Lattice Key Encapsulation Mechanism (CRYSTALS-Kyber) for quantum-resistant session secret derivation.
- **NIST FIPS 204 (ML-DSA)**: Module-Lattice Digital Signatures (CRYSTALS-Dilithium) for tamper-proof code audits and challenge flags.
- **Zero-Trust & Sandboxing**: Strict isolation of user-submitted circuits and code execution.
- **OWASP Top 10 Mitigation**: Parameterized database queries, strict CSP headers, Argon2id password hashing, and constant-time flag comparison.
