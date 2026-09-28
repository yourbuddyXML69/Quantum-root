# Security, Privacy & Compliance Architecture
## Quantoom Root — Unified Quantum + AI + Cybersecurity Community Platform

---

### 1. Zero Trust Architecture & Defense-in-Depth

Quantoom Root enforces strict Zero Trust principles across every layer of the application:
1. **Never Trust, Always Verify**: Every request—whether between client and gateway or inter-service microservice RPC—must be authenticated with cryptographically verified tokens.
2. **Least Privilege**: Users, worker processes, and AI agents run under tightly constrained roles. AI agents have read-only access to community data and cannot execute arbitrary shell commands.
3. **Continuous Monitoring**: All API interactions, job executions, flag submissions, and administrative events are written to an append-only immutable audit log.

---

### 2. Post-Quantum Cryptography (PQC) Migration

With the ratification of NIST standards, Quantoom Root provides native implementations and playground simulations for:
- **NIST FIPS 203 (ML-KEM)**: Module-Lattice Key Encapsulation Mechanism based on CRYSTALS-Kyber. Used to establish symmetric encryption keys immune to quantum Shor algorithm factorization.
- **NIST FIPS 204 (ML-DSA)**: Module-Lattice Digital Signature Algorithm based on CRYSTALS-Dilithium. Used to sign quantum job dispatches, CTF flags, and critical code reviews.
- **NIST FIPS 205 (SLH-DSA)**: Stateless Hash-Based Digital Signature Algorithm (SPHINCS+) for ultra-conservative root trust anchors.

---

### 3. Application Security Controls (OWASP Top 10 Mitigation)

| Threat Vector | Mitigation Strategy in Quantoom Root |
|---|---|
| **A01: Broken Access Control** | Centralized RBAC/ABAC middleware verifying user permissions per resource ID. Group and project access validated against membership tables. |
| **A02: Cryptographic Failures** | Argon2id for password hashing. Constant-time comparison for CTF flags. TLS 1.3 mandatory with PQC hybrid cipher suites. |
| **A03: Injection (SQL / Command / Prompt)** | Prisma ORM with parameterized SQL queries. Strict sandbox isolation for CTF execution. Guardrail filter classifying and stripping malicious prompt injections. |
| **A04: Insecure Design** | Threat modeling conducted across all quantum hardware adapters. Circuit depth and qubit counts enforced via hard resource quotas. |
| **A05: Security Misconfiguration** | Automated linters, CSP Level 3 headers (`default-src 'self'`), strict CORS origins, and minimal Alpine/distroless container images. |
| **A06: Vulnerable Components** | Automated CI/CD dependency scanning with Trivy and npm audit. CycloneDX Software Bill of Materials (SBOM) generation on every build. |
| **A07: Identification & Auth Failures** | Strict rate-limiting on login/registration endpoints. Time-based One-Time Passwords (TOTP) and Passkey (WebAuthn) support. |
| **A08: Software & Data Integrity Failures** | Quantum circuits and code submissions validated against strict schema parsers before simulation. Submissions signed with digital signatures. |
| **A09: Security Logging & Monitoring** | Live SIEM integration generating structured JSON events streamed over secure WebSockets with MITRE ATT&CK technique tags. |
| **A10: Server-Side Request Forgery (SSRF)** | Outbound webhooks restricted to whitelisted domains; DNS resolution restricted from reaching internal metadata IP addresses (e.g., `169.254.169.254`). |

---

### 4. Sandboxed Code Execution & Ethical CTF Boundaries

- **Strict Educational Consensual Policy**: No live targeting of external infrastructure or malicious payload generation is permitted.
- **MicroVM Isolation**: All CTF challenge environments execute inside isolated gVisor/Firecracker runtimes with strict cgroup limits:
  - Max Memory: 256MB
  - Max CPU Quota: 50% of 1 core
  - Max Lifetime: 15 minutes with auto-prune
  - No internet egress
- **AI Output Guardrails**: Prompts requesting weaponized exploits, real-world target recon, or evasion tactics are blocked with automated logging to the moderation queue.
