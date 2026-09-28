# System Assumptions & Architectural Baseline
## Quantoom Root — Unified Quantum + AI + Cybersecurity Community Platform

This document formalizes technical assumptions, operational boundaries, and design decisions made across the Quantoom Root platform.

---

### 1. Quantum Computing Hub Assumptions
1. **Local State-Vector Simulation Limit**:
   - Web browser and standard server instances support exact state-vector simulation for circuits up to **16 qubits** ($2^{16} = 65,536$ complex amplitudes).
   - Circuits requesting $> 16$ qubits are routed to high-performance compute clusters or dispatched as asynchronous batch jobs to external providers (IBM Quantum, AWS Braket, Azure Quantum).
2. **Provider Key Security**:
   - Provider API keys (e.g., IBM Quantum API tokens) are never stored in plaintext. They are encrypted using AES-256-GCM with a KMS-derived key, wrapped in an envelope signed by the user's Post-Quantum Dilithium public key.
3. **OpenQASM Compatibility**:
   - The transpiler natively ingests OpenQASM 2.0 and produces OpenQASM 3.0 compatible definitions (`stdgates.inc`).

---

### 2. AI Copilot & Knowledge Engine Assumptions
1. **Vector Dimension**:
   - Standard embedding space is parameterized at 1536 dimensions (matching `text-embedding-3-small` / open-source e5/bge-large models).
2. **Model Fallback Cascade**:
   - If commercial model providers (OpenAI / Anthropic / Gemini) experience transient outages or rate limits, the system seamlessly degrades to local Ollama inference models without dropping user sessions.
3. **Guardrail Enforcements**:
   - Malicious prompt injections attempting to weaponize code generation (e.g. real-world malware, exploit payloads, weaponized buffer overflows) are rejected deterministically before reaching any model router.

---

### 3. Cybersecurity Range & CTF Assumptions
1. **Educational & Sandboxed Boundary**:
   - All cybersecurity challenges are strictly defensive, educational, and isolated.
   - Challenge targets run in ephemeral, network-isolated environments (e.g., gVisor, Firecracker microVMs) with strict 15-minute time limits and resource quotas (0.5 vCPU, 256MB RAM).
   - Egress internet access is completely blocked (`iptables -P OUTPUT DROP`) except to the internal challenge scoring gate.
2. **Flag Cryptography**:
   - Flags follow standard formatting: `ROOT{<category>_<unique_entropy_token>}`.
   - Flag validation uses constant-time string comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.

---

### 4. Post-Quantum Cryptography (PQC) Assumptions
1. **Standard Compliance**:
   - Quantum-safe cryptographic primitives comply with NIST's final standardization:
     - **FIPS 203**: ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism, derived from CRYSTALS-Kyber).
     - **FIPS 204**: ML-DSA (Module-Lattice-Based Digital Signature Algorithm, derived from CRYSTALS-Dilithium).
2. **Hybrid Deployment**:
   - During the transition era, Quantoom Root uses hybrid classical-quantum schemes (X25519 + ML-KEM-768 for TLS/KEM, and Ed25519 + ML-DSA-65 for digital signatures).
