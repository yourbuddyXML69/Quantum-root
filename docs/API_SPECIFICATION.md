# API Specification & Protocol Design
## Quantoom Root — Unified Quantum + AI + Cybersecurity Community Platform
**API Version:** v1.0.0  
**Base URL:** `https://api.quantoomroot.io/api/v1` (Production) / `http://localhost:4000/api/v1` (Development)  
**Security:** Dual-Bearer JWT (Access + Refresh) + Optional Hybrid Post-Quantum Key Exchange  

---

### 1. Protocols & Content Types
Quantoom Root provides dual API interfaces:
- **RESTful Endpoints (`/api/v1/*`)**: Structured JSON for standard CRUD, compute dispatch, file uploads, and webhook triggers.
- **GraphQL Endpoint (`/graphql`)**: Rich nested graph queries for community feeds, user profiles, reputation badges, and real-time WebSocket subscriptions.
- **Real-Time WebSockets (`/ws`)**: High-frequency streaming for live SIEM telemetry, quantum job status updates, and peer-to-peer presence.

---

### 2. Standard Headers & Status Codes

#### Request Headers:
- `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- `Content-Type: application/json`
- `X-Quantum-PQC-Token: <DilithiumSignature>` (Required for administrative actions or quantum provider key updates)
- `X-Client-Version: 1.0.0`

#### Response Codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully provisioned.
- `400 Bad Request`: Input validation failed or malformed circuit/gate structure.
- `401 Unauthorized`: Token missing, expired, or invalid signature.
- `403 Forbidden`: Insufficient role or subscription tier permissions (RBAC/ABAC).
- `429 Too Many Requests`: Rate limit exceeded (Token bucket limit hit).
- `500 Internal Error`: Execution sandbox or backend failure.

---

### 3. REST API Endpoint Catalog

#### 3.1 Authentication & Post-Quantum Cryptography
- `POST /api/v1/auth/register`
  - Body: `{ email, username, password, primaryDomain }`
  - Returns: `{ user, accessToken, refreshToken }`
- `POST /api/v1/auth/login`
  - Body: `{ identifier, password, mfaCode? }`
  - Returns: `{ user, accessToken, refreshToken }`
- `POST /api/v1/auth/pqc/handshake`
  - Body: `{ clientKyberPublicKey }`
  - Returns: `{ serverKyberPublicKey, ciphertext, sharedSecretHash }`
- `GET /api/v1/auth/me`
  - Returns: Complete profile, skills, badges, and subscription info.

#### 3.2 Quantum Computing Hub
- `POST /api/v1/quantum/simulate`
  - Body:
    ```json
    {
      "numQubits": 2,
      "gates": [
        { "gate": "H", "targets": [0] },
        { "gate": "CNOT", "targets": [0, 1] }
      ],
      "shots": 1024
    }
    ```
  - Returns:
    ```json
    {
      "circuitName": "Bell State (|00> + |11>)/√2",
      "stateVector": [
        { "basis": "|00>", "real": 0.707106, "imag": 0.0, "probability": 0.5 },
        { "basis": "|01>", "real": 0.0, "imag": 0.0, "probability": 0.0 },
        { "basis": "|10>", "real": 0.0, "imag": 0.0, "probability": 0.0 },
        { "basis": "|11>", "real": 0.707106, "imag": 0.0, "probability": 0.5 }
      ],
      "blochAngles": [
        { "qubit": 0, "theta": 1.570796, "phi": 0.0, "coordinates": { "x": 1.0, "y": 0.0, "z": 0.0 } },
        { "qubit": 1, "theta": 1.570796, "phi": 0.0, "coordinates": { "x": 1.0, "y": 0.0, "z": 0.0 } }
      ],
      "measurements": { "00": 519, "11": 505 },
      "openQasm": "OPENQASM 3.0;\ninclude \"stdgates.inc\";\nqubit[2] q;\nh q[0];\ncx q[0], q[1];\n",
      "executionTimeMs": 2.45
    }
    ```
- `GET /api/v1/quantum/circuits`
  - Returns user's saved circuits and public community circuits.
- `POST /api/v1/quantum/circuits`
  - Save circuit to library.
- `POST /api/v1/quantum/transpile`
  - Transpile to OpenQASM, Qiskit, Cirq, or PennyLane format.

#### 3.3 AI Copilot & Knowledge Engine
- `POST /api/v1/ai/chat`
  - Body: `{ message, conversationId?, model?, ragDomain? }`
  - Returns: `{ response, citations: [...], modelUsed, tokensUsed }`
- `POST /api/v1/ai/review-code`
  - Body: `{ code, language }`
  - Returns: `{ findings: [{ line, severity, cwe, description, recommendation }], safe: boolean }`
- `POST /api/v1/ai/summarize-paper`
  - Body: `{ title, abstract, text }`
  - Returns: `{ summary, keyInsights: [...], mathematicalFormulas: [...], confidenceScore }`

#### 3.4 Cybersecurity Range
- `GET /api/v1/cyber/challenges`
  - Returns all active challenges with solved status and point values.
- `POST /api/v1/cyber/challenges/:id/submit-flag`
  - Body: `{ flag: "ROOT{...}" }`
  - Returns: `{ isCorrect: true, pointsAwarded: 150, firstBlood: false }`
- `GET /api/v1/cyber/siem/events`
  - Stream or fetch latest simulated SOC events (Zeek/Suricata) tagged with MITRE ATT&CK techniques.
- `GET /api/v1/cyber/threat-intel`
  - Returns active CVEs, zero-day advisories, and Post-Quantum cryptography migration alerts.

#### 3.5 Community & Social
- `GET /api/v1/community/feed`
  - Query params: `domain=QUANTUM|AI|CYBERSECURITY|CONVERGENCE`, `sort=hot|new|top`
- `POST /api/v1/community/posts`
  - Create post or question.
- `POST /api/v1/community/posts/:id/vote`
  - Upvote (+1) or downvote (-1).
- `POST /api/v1/community/posts/:id/comments`
  - Add threaded comment.
- `GET /api/v1/community/leaderboard`
  - Global reputation and CTF rankings.
