// Cybersecurity Range, Ethical CTF Sandbox & Real-Time SIEM Engine for Quantoom Root
import * as crypto from "crypto";

export interface CTFChallengeData {
  id: string;
  slug: string;
  title: string;
  category: "POST_QUANTUM_CRYPTO" | "WEB_SECURITY" | "REVERSE_ENGINEERING" | "FORENSICS" | "AI_RED_TEAMING";
  difficulty: "INTRO" | "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  points: number;
  flagHash: string; // SHA-256 / Argon2id hash of flag
  description: string;
  scenario: string;
  hints: { hint: string; penalty: number }[];
  solveCount: number;
  firstBloodUser?: string;
  tags: string[];
}

export interface SIEMLogEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  eventCategory: string;
  mitreTechnique: string;
  mitreTactic: string;
  description: string;
  payloadSummary: string;
}

export interface ThreatIntelAdvisory {
  id: string;
  cveId: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  affectedComponent: string;
  summary: string;
  pqcRelevance: string;
  remediation: string;
  publishedDate: string;
}

export class CyberRangeEngine {
  private challenges: Map<string, CTFChallengeData> = new Map();
  private solvedChallengesByUser: Map<string, Set<string>> = new Map(); // userId -> Set<challengeId>
  private userScores: Map<string, number> = new Map(); // userId -> totalPoints

  constructor() {
    this.seedChallenges();
  }

  // Hash helper for flags
  private static hashFlag(flag: string): string {
    return crypto.createHash("sha256").update(flag.trim()).digest("hex");
  }

  private seedChallenges(): void {
    const list: CTFChallengeData[] = [
      {
        id: "pqc-01",
        slug: "breaking-classical-rsa",
        title: "Lattice Guardians: Defeating Weak Moduli",
        category: "POST_QUANTUM_CRYPTO",
        difficulty: "MEDIUM",
        points: 250,
        flagHash: CyberRangeEngine.hashFlag("ROOT{fips_203_kyber_defeats_shor_factoring_9981}"),
        description: "An outdated legacy key exchange service is using a small 512-bit RSA modulus for hardware token authentication alongside an unverified lattice seed. Recover the prime factors $p$ and $q$ to forge the verification token and capture the post-quantum transition flag.",
        scenario: "You are tasked with evaluating an enterprise banking subsystem before its migration to NIST FIPS 203 ML-KEM. The server exposes public key $(N, e)$ with $N = 10142789312725007...$. Factorize the modulus or reconstruct the lattice ring vector to prove vulnerability.",
        hints: [
          { hint: "The prime difference |p - q| is surprisingly small; Fermat's factorization method or a 4-qubit Shor simulation will resolve it immediately.", penalty: 25 },
          { hint: "Look at the ML-KEM polynomial reduction coefficients in the challenge artifact.", penalty: 50 }
        ],
        solveCount: 42,
        firstBloodUser: "dr_elena_vance",
        tags: ["PQC", "Shor-Algorithm", "Lattice-Crypto", "FIPS-203"],
      },
      {
        id: "qkd-02",
        slug: "bb84-eavesdropping-qber",
        title: "Quantum Key Distribution: The Eve Anomaly",
        category: "FORENSICS",
        difficulty: "EASY",
        points: 150,
        flagHash: CyberRangeEngine.hashFlag("ROOT{bb84_qber_above_11pct_intercepted_4402}"),
        description: "Analyze a photon polarization transmission log between Alice and Bob running the BB84 protocol. Determine the Quantum Bit Error Rate (QBER) introduced by an eavesdropper measuring in random bases, and extract the reconciled secret key.",
        scenario: "Alice transmits 10,000 single photons across a fiber optic link using Rectilinear (+) and Diagonal (x) bases. Bob measures on his chosen basis. The telemetry logs indicate anomalous bit errors. Calculate whether QBER exceeds the Shor-Preskill security bound (11%) to decrypt the flag.",
        hints: [
          { hint: "When Eve intercepts and resends in a random basis, she causes a 25% error rate on matching bases.", penalty: 20 }
        ],
        solveCount: 88,
        firstBloodUser: "nexus_cyber",
        tags: ["QKD", "BB84", "Quantum-Forensics", "Photonics"],
      },
      {
        id: "ai-03",
        slug: "adversarial-circuit-jailbreak",
        title: "AI Red Teaming: The Hallucinated Ansatz",
        category: "AI_RED_TEAMING",
        difficulty: "HARD",
        points: 350,
        flagHash: CyberRangeEngine.hashFlag("ROOT{prompt_jailbreak_quantum_ansatz_bypass_7719}"),
        description: "An automated AI agent evaluates submitted quantum circuits for patent validation. Construct an adversarial prompt injection disguised as a mathematical ansatz to force the AI agent to divulge its hidden evaluation prompt and root verification flag.",
        scenario: "The patent validation agent accepts LaTeX circuit descriptions. Craft a multi-turn prompt that bypasses delimiter boundaries while maintaining valid quantum unitary notation.",
        hints: [
          { hint: "Encode instructions inside Unicode braille or mathematical blackboard bold characters.", penalty: 50 }
        ],
        solveCount: 19,
        firstBloodUser: "marcus_ml",
        tags: ["AI-Security", "Jailbreak", "Prompt-Injection", "Red-Teaming"],
      },
      {
        id: "web-04",
        slug: "quantum-job-idor",
        title: "Superposition IDOR: Quantum Job Leak",
        category: "WEB_SECURITY",
        difficulty: "EASY",
        points: 100,
        flagHash: CyberRangeEngine.hashFlag("ROOT{idor_qubit_state_vector_exposed_3133}"),
        description: "A quantum cloud provider exposes an API endpoint for retrieving job telemetry: `/api/v1/jobs/{job_uuid}/results`. Discover an Insecure Direct Object Reference flaw allowing unauthorized viewing of top-secret circuit execution data.",
        scenario: "Examine the UUID v1 sequence or sequential fallback parameter to access Job #0001 dispatched by a government defense contractor.",
        hints: [
          { hint: "Check if the API accepts numeric legacy job IDs in addition to UUIDs.", penalty: 15 }
        ],
        solveCount: 114,
        firstBloodUser: "zero_cool",
        tags: ["IDOR", "Web-API", "Access-Control", "OWASP-A01"],
      },
      {
        id: "rev-05",
        slug: "qasm-decompiler-mystery",
        title: "Reverse Engineering: The Obfuscated QASM Gate",
        category: "REVERSE_ENGINEERING",
        difficulty: "MEDIUM",
        points: 200,
        flagHash: CyberRangeEngine.hashFlag("ROOT{reverse_engineered_toffoli_decomposition_8241}"),
        description: "Reverse engineer a compiled 5-qubit circuit binary. The author decomposed a Toffoli gate into single-qubit rotations and CNOT gates to obfuscate the state selector. Reconstruct the unitary truth table.",
        scenario: "A proprietary quantum key generator outputs an ELF binary containing raw OpenQASM pulse instructions. Disassemble the binary and extract the target bitstring.",
        hints: [
          { hint: "Look for sequences of T and T_dagger gates coupled with alternating CNOTs.", penalty: 30 }
        ],
        solveCount: 53,
        firstBloodUser: "circuit_ninja",
        tags: ["Reverse-Engineering", "OpenQASM", "Decompilation", "Gate-Synthesis"],
      },
    ];

    for (const c of list) {
      this.challenges.set(c.id, c);
    }
  }

  // Get all public challenges
  getChallenges(): CTFChallengeData[] {
    return Array.from(this.challenges.values()).map((c) => ({
      ...c,
      flagHash: "REDACTED", // Never send flag hashes to client
    }));
  }

  // Verify flag in constant-time
  verifyFlag(userId: string, challengeId: string, submittedFlag: string): { isCorrect: boolean; pointsAwarded: number; message: string } {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      return { isCorrect: false, pointsAwarded: 0, message: "Challenge not found." };
    }

    // Check if already solved
    const userSolved = this.solvedChallengesByUser.get(userId) || new Set();
    if (userSolved.has(challengeId)) {
      return { isCorrect: false, pointsAwarded: 0, message: "You have already completed this challenge." };
    }

    const submittedHash = CyberRangeEngine.hashFlag(submittedFlag);
    const targetHash = challenge.flagHash;

    // Constant-time buffer comparison to prevent timing leaks
    const bufSubmitted = Buffer.from(submittedHash, "hex");
    const bufTarget = Buffer.from(targetHash, "hex");

    if (bufSubmitted.length === bufTarget.length && crypto.timingSafeEqual(bufSubmitted, bufTarget)) {
      userSolved.add(challengeId);
      this.solvedChallengesByUser.set(userId, userSolved);

      const currentScore = this.userScores.get(userId) || 0;
      this.userScores.set(userId, currentScore + challenge.points);
      challenge.solveCount += 1;

      return {
        isCorrect: true,
        pointsAwarded: challenge.points,
        message: `🎉 Correct Flag! You have been awarded +${challenge.points} reputation points.`,
      };
    }

    return { isCorrect: false, pointsAwarded: 0, message: "❌ Incorrect flag. Verify your calculations and try again." };
  }

  // Real-time SIEM Log Stream Generator (Simulating Zeek / Suricata / MITRE telemetry)
  static generateSampleSIEMEvents(count: number = 8): SIEMLogEvent[] {
    const templates = [
      {
        severity: "CRITICAL" as const,
        eventCategory: "POST_QUANTUM_HARVEST",
        mitreTechnique: "T1588.006",
        mitreTactic: "Resource Development",
        protocol: "TLSv1.3-X25519",
        description: "Bulk exfiltration of encrypted government traffic detected without ML-KEM wrapper. Suspected Harvest-Now-Decrypt-Later activity.",
        sourceIp: "198.51.100.44",
        destIp: "10.0.4.15",
        payloadSummary: "Encrypted stream exfiltration: 1.42 GB to unknown ASN",
      },
      {
        severity: "HIGH" as const,
        eventCategory: "PROMPT_INJECTION_ATTEMPT",
        mitreTechnique: "T1059.006",
        mitreTactic: "Execution",
        protocol: "HTTPS-REST",
        description: "Adversarial jailbreak payload detected against Quantoom AI Research Agent. Sanitized by input guardrail filter.",
        sourceIp: "203.0.113.88",
        destIp: "10.0.1.20",
        payloadSummary: "POST /api/v1/ai/chat payload contains DAN jailbreak signature",
      },
      {
        severity: "MEDIUM" as const,
        eventCategory: "QUANTUM_JOB_BRUTE_FORCE",
        mitreTechnique: "T1110.001",
        mitreTactic: "Credential Access",
        protocol: "gRPC",
        description: "Repeated unauthorized attempts to access IBM Quantum API hardware token via brute-force identifier scan.",
        sourceIp: "192.0.2.190",
        destIp: "10.0.8.2",
        payloadSummary: "42 failed auth handshakes in 30 seconds",
      },
      {
        severity: "LOW" as const,
        eventCategory: "QKD_PHOTON_ANOMALY",
        mitreTechnique: "T1040",
        mitreTactic: "Discovery",
        protocol: "QKD-BB84",
        description: "Transient photon polarization decoherence detected on fiber trunk Alpha-9. QBER remains within safe margin (3.1%).",
        sourceIp: "10.200.1.5",
        destIp: "10.200.1.6",
        payloadSummary: "Telemetry frame 99281: QBER 3.12%, Bit Sifting matched 5,102 photons",
      },
      {
        severity: "HIGH" as const,
        eventCategory: "ZERO_DAY_EXPLOIT_ATTEMPT",
        mitreTechnique: "T1190",
        mitreTactic: "Initial Access",
        protocol: "TCP/443",
        description: "Exploit signature matching CVE-2024-PostQuantum against web application gateway. Request blocked by WAF.",
        sourceIp: "185.220.101.5",
        destIp: "10.0.0.1",
        payloadSummary: "Malformed ASN.1 DER sequence in client hello handshake",
      },
    ];

    const results: SIEMLogEvent[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const t = templates[i % templates.length];
      results.push({
        id: `siem-evt-${now}-${i}`,
        timestamp: new Date(now - i * 45000).toISOString(),
        sourceIp: t.sourceIp,
        destIp: t.destIp,
        protocol: t.protocol,
        severity: t.severity,
        eventCategory: t.eventCategory,
        mitreTechnique: t.mitreTechnique,
        mitreTactic: t.mitreTactic,
        description: t.description,
        payloadSummary: t.payloadSummary,
      });
    }

    return results;
  }

  // Active Threat Intel & CVE Corpus
  static getThreatIntelFeed(): ThreatIntelAdvisory[] {
    return [
      {
        id: "intel-01",
        cveId: "CVE-2024-8199",
        title: "Classical RSA Key Exchange Harvest Threat (HNDL)",
        severity: "CRITICAL",
        affectedComponent: "OpenSSL / TLS 1.2 / Classical Key Exchanges",
        summary: "State-sponsored actors are actively archiving high-value diplomatic and financial traffic encrypted with RSA-2048 and ECDH P-256 for decryption when quantum computers attain sufficient logical qubit capacity.",
        pqcRelevance: "Mandates urgent deployment of hybrid TLS with NIST FIPS 203 (ML-KEM-768).",
        remediation: "Upgrade perimeter proxies to hybrid X25519_MLKEM768 cipher suites.",
        publishedDate: "2026-09-15",
      },
      {
        id: "intel-02",
        cveId: "CVE-2024-5210",
        title: "Adversarial Prompt Injection in Autonomous AI Coding Assistants",
        severity: "HIGH",
        affectedComponent: "LangChain / RAG Pipeline Agents",
        summary: "Indirect prompt injection via untrusted code repositories leading to unauthorized execution of local CLI commands.",
        pqcRelevance: "Demonstrates the necessity of strict sandbox isolation and deterministically signed agent outputs.",
        remediation: "Deploy AST input sanitizers and enforce strict output boundary regex token checking.",
        publishedDate: "2026-09-22",
      },
      {
        id: "intel-03",
        cveId: "CVE-2024-3991",
        title: "Side-Channel Power Analysis in Quantum Control Electronics",
        severity: "MEDIUM",
        affectedComponent: "FPGA Qubit Pulse Controllers",
        summary: "Electromagnetic emissions from cryogenic microwave pulse generators leak qubit state rotation parameters.",
        pqcRelevance: "Impacts physical security of superconducting qubit control hardware.",
        remediation: "Apply RF shielding and randomize pulse baseline calibration sequences.",
        publishedDate: "2026-09-08",
      },
    ];
  }
}
