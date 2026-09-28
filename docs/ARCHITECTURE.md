# System Architecture & Technical Specifications
## Quantoom Root — Unified Quantum + AI + Cybersecurity Community Platform
**Document Version:** 1.0.0  
**Target Infrastructure:** Cloud-Native / Multi-Cloud / Kubernetes Ready  

---

### 1. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph ClientLayer ["Client & Edge Layer (WCAG 2.2 AA)"]
        UI["Web App (Next.js 14+ / React / Tailwind / Radix UI)"]
        PWA["Progressive Web App (Mobile / Desktop)"]
        CLI["Quantoom CLI (Python / Rust SDK)"]
        CDN["Cloudflare Edge / WAF / DDoS Protection"]
    end

    subgraph GatewayLayer ["API Gateway & Security Ingress"]
        Kong["API Gateway / Ingress Controller"]
        AuthMid["Auth Engine: JWT + OAuth2 + PQC (Kyber/Dilithium)"]
        RateLimit["Redis Rate Limiter & Token Bucket"]
    end

    subgraph ApplicationServices ["Core Application Services (Node.js / Express / TypeScript)"]
        CommService["Community & Social Service (Feeds, Q&A, DMs, Groups)"]
        QuantumService["Quantum Orchestrator (Simulators, OpenQASM, Hardware Adapter)"]
        AIService["AI Knowledge Engine (RAG, Guardrails, Model Router)"]
        CyberService["Cyber Range & SIEM Service (CTF Engine, MITRE ATT&CK, Threat Feeds)"]
        ProjectService["Convergence Projects & Hackathon Workspace"]
    end

    subgraph ComputeEngines ["Specialized Compute & Execution Sandboxes"]
        QSimWorker["Quantum Simulator Engine (State Vector & Bloch Sphere)"]
        QHardwareBridge["Hardware Providers (IBM Quantum, AWS Braket, Azure Quantum)"]
        AIRouter["Model Router (OpenAI, Anthropic, Gemini, Local Ollama)"]
        CTFSandbox["Sandboxed CTF Environment (gVisor / Firecracker MicroVMs)"]
        SIEMStreamer["Real-Time Security Event & Log Generator (Zeek / Suricata)"]
    end

    subgraph DataStorage ["Data & State Persistence Layer"]
        Postgres[(PostgreSQL 16 + Prisma ORM)]
        VectorDB[(Vector Store: pgvector / Qdrant)]
        RedisCache[(Redis Cluster: Cache, Pub/Sub, Presence)]
        S3Storage[(S3 Compatible Object Store: Artifacts, Datasets)]
    end

    UI --> CDN
    PWA --> CDN
    CLI --> CDN
    CDN --> Kong
    Kong --> AuthMid
    AuthMid --> RateLimit
    RateLimit --> CommService
    RateLimit --> QuantumService
    RateLimit --> AIService
    RateLimit --> CyberService
    RateLimit --> ProjectService

    QuantumService --> QSimWorker
    QuantumService --> QHardwareBridge
    AIService --> AIRouter
    AIService --> VectorDB
    CyberService --> CTFSandbox
    CyberService --> SIEMStreamer

    CommService --> Postgres
    CommService --> RedisCache
    QuantumService --> Postgres
    CyberService --> Postgres
    ProjectService --> Postgres
    ProjectService --> S3Storage
    AIService --> Postgres
```

---

### 2. Quantum Computing Hub Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Researcher / User
    participant UI as Circuit Composer UI
    participant QService as Quantum Orchestrator API
    participant Engine as Quantum State Simulator
    participant Transpiler as OpenQASM / Qiskit Transpiler
    participant HW as Hardware Provider (IBM / Braket)
    participant DB as Postgres & State Store

    User->>UI: Place Gates (H, X, CNOT, Rz, Measure)
    UI->>UI: Update Local Circuit Matrix & Gate Map
    UI->>QService: POST /api/quantum/simulate (circuit_json, shots=1024)
    QService->>Engine: Calculate State Vector (|ψ⟩ = Σ c_i |i⟩)
    Engine->>Engine: Compute Complex Amplitudes & Probabilities
    Engine->>Engine: Calculate Bloch Angles (θ, φ) per Qubit
    Engine->>Engine: Sample Measurement Distribution
    Engine-->>QService: { stateVector, blochCoordinates, measurementCounts }
    QService->>DB: Save Circuit & Execution Audit
    QService-->>UI: Return Simulation Results
    UI->>User: Render 3D Bloch Spheres & Probability Histogram

    opt Optional Real Hardware Execution
        User->>UI: Dispatch to IBM / Braket
        UI->>QService: POST /api/quantum/jobs/dispatch
        QService->>Transpiler: Transpile to OpenQASM 3.0
        Transpiler-->>QService: OpenQASM String
        QService->>HW: Dispatch Job via Provider API Key
        HW-->>QService: Job ID (QUEUED)
        QService-->>UI: Polling / WebSocket Subscription
    end
```

---

### 3. AI Copilot & Knowledge Engine (RAG Pipeline)

```mermaid
flowchart LR
    subgraph Ingestion ["Knowledge Ingestion Pipeline"]
        Papers["arXiv Quantum/AI Papers"]
        RFCs["NIST PQC Standards (FIPS 203/204)"]
        CVEs["CVE & MITRE ATT&CK Corpus"]
        Chunker["Recursive Text Splitter & Chunker"]
        Embedder["Embedding Model (text-embedding-3 / Local)"]
    end

    subgraph QueryExecution ["RAG Query & Guardrail Pipeline"]
        UserQuery["User Query / Code Review Request"]
        GuardrailCheck{"Input Guardrail & Jailbreak Filter"}
        SimSearch["Vector Similarity Search (Cosine Distance)"]
        ContextAssembler["Prompt & Context Assembler with Citations"]
        ModelRouter["Multi-Model Router (OpenAI / Gemini / Claude / Ollama)"]
        ResponseValidator["Output Sanitization & Hallucination Check"]
    end

    Papers --> Chunker
    RFCs --> Chunker
    CVEs --> Chunker
    Chunker --> Embedder
    Embedder --> VectorDB[(Vector Store)]

    UserQuery --> GuardrailCheck
    GuardrailCheck -- Violation --> Reject["400 Reject Request"]
    GuardrailCheck -- Clean --> SimSearch
    VectorDB --> SimSearch
    SimSearch --> ContextAssembler
    ContextAssembler --> ModelRouter
    ModelRouter --> ResponseValidator
    ResponseValidator --> UserOutput["Response with Interactive Citations & Artifacts"]
```

---

### 4. Cybersecurity Range & Zero-Trust Isolation Architecture

```mermaid
flowchart TD
    subgraph RangeUI ["Cyber Range Interface"]
        ChallengeList["CTF Challenges Directory"]
        TerminalEmul["In-Browser Web Terminal & Shell"]
        SIEMMonitor["Live SIEM Log Viewer (Zeek/Suricata)"]
        FlagInput["Dynamic Flag Submission"]
    end

    subgraph RangeEngine ["Cyber Range Orchestrator"]
        TokenAuth["Zero-Trust Session Token"]
        RateGate["Anti-Bruteforce Token Bucket"]
        FlagHasher["Argon2id Constant-Time Validator"]
        ScoreEngine["Dynamic Scoring & First Blood Allocator"]
    end

    subgraph SandboxCluster ["Ephemeral Isolated Environments"]
        EnvController["Ephemeral Container Controller"]
        gVisorInstance["gVisor / MicroVM Sandbox (Per-User Instance)"]
        NetworkIsolated["Isolated Overlay Network (No Outbound Internet)"]
    end

    ChallengeList --> TokenAuth
    TerminalEmul --> TokenAuth
    TokenAuth --> RateGate
    RateGate --> EnvController
    EnvController --> gVisorInstance
    gVisorInstance --- NetworkIsolated
    FlagInput --> FlagHasher
    FlagHasher --> ScoreEngine
    ScoreEngine --> LeaderboardDB[(Leaderboard & Postgres)]
    SIEMMonitor <--> EventStreamer["WebSocket SIEM Event Streamer"]
```

---

### 5. Post-Quantum Cryptography Hybrid Architecture

To safeguard sensitive credentials, API keys for quantum hardware, and encrypted community DMs against **Harvest Now, Decrypt Later (HNDL)** attacks by quantum adversaries running Shor's algorithm, Quantoom Root implements a hybrid post-quantum envelope:

1. **Key Encapsulation (KEM)**: Combines classical ECDH (Curve25519) with NIST FIPS 203 **ML-KEM (CRYSTALS-Kyber-768)**.
2. **Digital Signatures**: Combines Ed25519 with NIST FIPS 204 **ML-DSA (CRYSTALS-Dilithium-3)** for tamper-proof verification of quantum hardware credentials and CTF flags.
3. **Session Master Key Derivation**:
   $$K_{master} = \text{HKDF-Extract-Expand}(\text{ECDH}_{secret} \parallel \text{Kyber}_{shared\_secret}, \text{Salt})$$

---

### 6. Database & Persistent Storage Topology

- **Primary Relational Store**: PostgreSQL with schema enforcement for users, reputation, posts, quantum circuits, jobs, CTF challenges, and SIEM logs.
- **Cache & Presence Store**: Redis 7 cluster managing active user presence, rate limiting buckets, Pub/Sub channels for real-time DMs and SIEM alert broadcasts.
- **Vector Store**: pgvector / Qdrant handling 1536-dimensional embeddings for research papers, code repositories, and documentation.
- **Object Storage**: S3-compatible MinIO/AWS S3 storing user avatars, exported circuit diagrams, notebook archives, and CTF binary artifacts.
