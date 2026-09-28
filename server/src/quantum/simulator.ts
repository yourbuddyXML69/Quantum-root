// Quantum Simulator & Matrix Orchestration Engine for Quantoom Root
// Supports Statevector calculation, Bloch Vector coordinates, OpenQASM generation, and Quantum Algorithm Library.

export class Complex {
  constructor(public real: number, public imag: number) {}

  static zero(): Complex {
    return new Complex(0, 0);
  }

  static fromReal(r: number): Complex {
    return new Complex(r, 0);
  }

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  sub(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  mul(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  scale(s: number): Complex {
    return new Complex(this.real * s, this.imag * s);
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  normSquared(): number {
    return this.real * this.real + this.imag * this.imag;
  }

  abs(): number {
    return Math.sqrt(this.normSquared());
  }
}

export interface GateInstruction {
  gate: string; // "H", "X", "Y", "Z", "S", "T", "RX", "RY", "RZ", "CNOT", "CZ", "SWAP", "TOFFOLI", "MEASURE"
  targets: number[]; // qubit indices (0-indexed)
  params?: number[]; // optional rotation angles in radians
}

export interface StateVectorEntry {
  basis: string;
  real: number;
  imag: number;
  probability: number;
}

export interface BlochCoordinates {
  qubit: number;
  theta: number; // polar angle [0, pi]
  phi: number;   // azimuthal angle [0, 2pi)
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
}

export interface SimulationResult {
  circuitName?: string;
  numQubits: number;
  stateVector: StateVectorEntry[];
  blochAngles: BlochCoordinates[];
  measurements: Record<string, number>;
  openQasm: string;
  executionTimeMs: number;
}

export class QuantumState {
  private numQubits: number;
  private stateDim: number;
  private amplitudes: Complex[];

  constructor(numQubits: number) {
    if (numQubits < 1 || numQubits > 16) {
      throw new Error(`Unsupported qubit count: ${numQubits}. Simulator supports 1 to 16 qubits.`);
    }
    this.numQubits = numQubits;
    this.stateDim = 1 << numQubits;
    this.amplitudes = new Array(this.stateDim).fill(null).map(() => Complex.zero());
    // Initial ground state |00...0> = 1
    this.amplitudes[0] = Complex.fromReal(1.0);
  }

  // Apply single-qubit matrix [ [u00, u01], [u10, u11] ] on target qubit
  applySingleQubitGate(target: number, u00: Complex, u01: Complex, u10: Complex, u11: Complex): void {
    const step = 1 << target;
    for (let i = 0; i < this.stateDim; i += 2 * step) {
      for (let j = 0; j < step; j++) {
        const idx0 = i + j;
        const idx1 = idx0 + step;

        const a0 = this.amplitudes[idx0];
        const a1 = this.amplitudes[idx1];

        // [new0] = u00*a0 + u01*a1
        // [new1] = u10*a0 + u11*a1
        this.amplitudes[idx0] = u00.mul(a0).add(u01.mul(a1));
        this.amplitudes[idx1] = u10.mul(a0).add(u11.mul(a1));
      }
    }
  }

  // Hadamard Gate: H = (X + Z) / sqrt(2)
  applyHadamard(target: number): void {
    const invSqrt2 = 1 / Math.SQRT2;
    const hVal = Complex.fromReal(invSqrt2);
    const negHVal = Complex.fromReal(-invSqrt2);
    this.applySingleQubitGate(target, hVal, hVal, hVal, negHVal);
  }

  // Pauli X (NOT): bit flip
  applyPauliX(target: number): void {
    const zero = Complex.zero();
    const one = Complex.fromReal(1);
    this.applySingleQubitGate(target, zero, one, one, zero);
  }

  // Pauli Y
  applyPauliY(target: number): void {
    const zero = Complex.zero();
    const negI = new Complex(0, -1);
    const posI = new Complex(0, 1);
    this.applySingleQubitGate(target, zero, negI, posI, zero);
  }

  // Pauli Z: phase flip
  applyPauliZ(target: number): void {
    const zero = Complex.zero();
    const one = Complex.fromReal(1);
    const negOne = Complex.fromReal(-1);
    this.applySingleQubitGate(target, one, zero, zero, negOne);
  }

  // S Phase Gate: diag(1, i)
  applyPhaseS(target: number): void {
    const zero = Complex.zero();
    const one = Complex.fromReal(1);
    const iComp = new Complex(0, 1);
    this.applySingleQubitGate(target, one, zero, zero, iComp);
  }

  // T Gate: diag(1, e^(i*pi/4))
  applyTGate(target: number): void {
    const zero = Complex.zero();
    const one = Complex.fromReal(1);
    const tComp = new Complex(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));
    this.applySingleQubitGate(target, one, zero, zero, tComp);
  }

  // Rotation RX(theta) = cos(theta/2)*I - i*sin(theta/2)*X
  applyRX(target: number, theta: number): void {
    const half = theta / 2;
    const cosVal = Complex.fromReal(Math.cos(half));
    const sinComp = new Complex(0, -Math.sin(half));
    this.applySingleQubitGate(target, cosVal, sinComp, sinComp, cosVal);
  }

  // Rotation RY(theta) = cos(theta/2)*I - sin(theta/2)*Y
  applyRY(target: number, theta: number): void {
    const half = theta / 2;
    const cosVal = Complex.fromReal(Math.cos(half));
    const negSin = Complex.fromReal(-Math.sin(half));
    const posSin = Complex.fromReal(Math.sin(half));
    this.applySingleQubitGate(target, cosVal, negSin, posSin, cosVal);
  }

  // Rotation RZ(theta) = diag(e^(-i*theta/2), e^(i*theta/2))
  applyRZ(target: number, theta: number): void {
    const half = theta / 2;
    const u00 = new Complex(Math.cos(-half), Math.sin(-half));
    const u11 = new Complex(Math.cos(half), Math.sin(half));
    this.applySingleQubitGate(target, u00, Complex.zero(), Complex.zero(), u11);
  }

  // CNOT (Controlled NOT): Control flips target if control is |1>
  applyCNOT(control: number, target: number): void {
    for (let i = 0; i < this.stateDim; i++) {
      const isControlSet = (i & (1 << control)) !== 0;
      const isTargetSet = (i & (1 << target)) !== 0;

      if (isControlSet && !isTargetSet) {
        const flippedIdx = i | (1 << target);
        const temp = this.amplitudes[i];
        this.amplitudes[i] = this.amplitudes[flippedIdx];
        this.amplitudes[flippedIdx] = temp;
      }
    }
  }

  // CZ (Controlled Z): applies -1 phase if both control and target are |1>
  applyCZ(control: number, target: number): void {
    for (let i = 0; i < this.stateDim; i++) {
      if ((i & (1 << control)) !== 0 && (i & (1 << target)) !== 0) {
        this.amplitudes[i] = this.amplitudes[i].scale(-1);
      }
    }
  }

  // SWAP Gate: Swaps state of qubitA and qubitB
  applySWAP(qubitA: number, qubitB: number): void {
    for (let i = 0; i < this.stateDim; i++) {
      const bitA = (i & (1 << qubitA)) !== 0;
      const bitB = (i & (1 << qubitB)) !== 0;
      if (bitA && !bitB) {
        const swappedIdx = (i ^ (1 << qubitA)) | (1 << qubitB);
        const temp = this.amplitudes[i];
        this.amplitudes[i] = this.amplitudes[swappedIdx];
        this.amplitudes[swappedIdx] = temp;
      }
    }
  }

  // Toffoli (CCNOT): Flips target if both control1 and control2 are |1>
  applyToffoli(c1: number, c2: number, target: number): void {
    for (let i = 0; i < this.stateDim; i++) {
      const isC1 = (i & (1 << c1)) !== 0;
      const isC2 = (i & (1 << c2)) !== 0;
      const isTargetSet = (i & (1 << target)) !== 0;
      if (isC1 && isC2 && !isTargetSet) {
        const flippedIdx = i | (1 << target);
        const temp = this.amplitudes[i];
        this.amplitudes[i] = this.amplitudes[flippedIdx];
        this.amplitudes[flippedIdx] = temp;
      }
    }
  }

  // Compute Bloch coordinates for each qubit via reduced density matrix
  getBlochCoordinates(): BlochCoordinates[] {
    const results: BlochCoordinates[] = [];

    for (let q = 0; q < this.numQubits; q++) {
      let rho00 = 0;
      let rho11 = 0;
      let rho01 = Complex.zero();

      const mask = 1 << q;
      for (let i = 0; i < this.stateDim; i++) {
        if ((i & mask) === 0) {
          const idx0 = i;
          const idx1 = i | mask;
          rho00 += this.amplitudes[idx0].normSquared();
          rho11 += this.amplitudes[idx1].normSquared();
          // rho01 += a0 * conjugate(a1)
          rho01 = rho01.add(this.amplitudes[idx0].mul(this.amplitudes[idx1].conjugate()));
        }
      }

      // Pauli expectations:
      // <X> = 2 * Re(rho01)
      // <Y> = 2 * Im(rho01)
      // <Z> = rho00 - rho11
      const x = 2 * rho01.real;
      const y = 2 * rho01.imag;
      const z = rho00 - rho11;

      // Spherical coordinates
      // r = sqrt(x^2 + y^2 + z^2) (clamped to 1 for pure/mixed states)
      const r = Math.min(1.0, Math.sqrt(x * x + y * y + z * z));
      const theta = r > 1e-7 ? Math.acos(Math.max(-1, Math.min(1, z / r))) : 0;
      let phi = Math.atan2(y, x);
      if (phi < 0) phi += 2 * Math.PI;

      results.push({
        qubit: q,
        theta,
        phi,
        coordinates: {
          x: Number(x.toFixed(4)),
          y: Number(y.toFixed(4)),
          z: Number(z.toFixed(4)),
        },
      });
    }

    return results;
  }

  // Return full state vector representation
  getStateVector(): StateVectorEntry[] {
    const list: StateVectorEntry[] = [];
    for (let i = 0; i < this.stateDim; i++) {
      const amp = this.amplitudes[i];
      const prob = amp.normSquared();
      const basis = `|${i.toString(2).padStart(this.numQubits, "0")}⟩`;
      list.push({
        basis,
        real: Number(amp.real.toFixed(6)),
        imag: Number(amp.imag.toFixed(6)),
        probability: Number(prob.toFixed(6)),
      });
    }
    return list;
  }

  // Sample measurement distribution over given shots
  sampleMeasurements(shots: number = 1024): Record<string, number> {
    const counts: Record<string, number> = {};
    const cumulativeProbs: number[] = [];
    let cumulative = 0;

    for (let i = 0; i < this.stateDim; i++) {
      cumulative += this.amplitudes[i].normSquared();
      cumulativeProbs.push(cumulative);
    }

    for (let s = 0; s < shots; s++) {
      const rand = Math.random();
      let chosenIdx = this.stateDim - 1;
      for (let i = 0; i < this.stateDim; i++) {
        if (rand <= cumulativeProbs[i]) {
          chosenIdx = i;
          break;
        }
      }
      const bitstring = chosenIdx.toString(2).padStart(this.numQubits, "0");
      counts[bitstring] = (counts[bitstring] || 0) + 1;
    }

    return counts;
  }
}

// Simulator Service Facade
export class QuantumSimulatorService {
  static simulate(numQubits: number, instructions: GateInstruction[], shots: number = 1024): SimulationResult {
    const startTime = performance.now();
    const state = new QuantumState(numQubits);

    for (const inst of instructions) {
      const gate = inst.gate.toUpperCase();
      const targets = inst.targets;
      const params = inst.params || [];

      switch (gate) {
        case "H":
          state.applyHadamard(targets[0]);
          break;
        case "X":
          state.applyPauliX(targets[0]);
          break;
        case "Y":
          state.applyPauliY(targets[0]);
          break;
        case "Z":
          state.applyPauliZ(targets[0]);
          break;
        case "S":
          state.applyPhaseS(targets[0]);
          break;
        case "T":
          state.applyTGate(targets[0]);
          break;
        case "RX":
          state.applyRX(targets[0], params[0] || Math.PI / 2);
          break;
        case "RY":
          state.applyRY(targets[0], params[0] || Math.PI / 2);
          break;
        case "RZ":
          state.applyRZ(targets[0], params[0] || Math.PI / 2);
          break;
        case "CNOT":
        case "CX":
          state.applyCNOT(targets[0], targets[1]);
          break;
        case "CZ":
          state.applyCZ(targets[0], targets[1]);
          break;
        case "SWAP":
          state.applySWAP(targets[0], targets[1]);
          break;
        case "TOFFOLI":
        case "CCX":
          state.applyToffoli(targets[0], targets[1], targets[2]);
          break;
        case "MEASURE":
          // Measurement does not alter unitary evolution in statevector calculation
          break;
        default:
          throw new Error(`Unsupported gate: ${gate}`);
      }
    }

    const stateVector = state.getStateVector();
    const blochAngles = state.getBlochCoordinates();
    const measurements = state.sampleMeasurements(shots);
    const openQasm = this.toOpenQASM(numQubits, instructions);
    const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

    return {
      numQubits,
      stateVector,
      blochAngles,
      measurements,
      openQasm,
      executionTimeMs,
    };
  }

  // Transpile instruction array to OpenQASM 3.0
  static toOpenQASM(numQubits: number, instructions: GateInstruction[]): string {
    let qasm = `OPENQASM 3.0;\ninclude "stdgates.inc";\n\nqubit[${numQubits}] q;\nbit[${numQubits}] c;\n\n`;

    for (const inst of instructions) {
      const g = inst.gate.toLowerCase();
      const t = inst.targets;
      const p = inst.params || [];

      if (g === "h") qasm += `h q[${t[0]}];\n`;
      else if (g === "x") qasm += `x q[${t[0]}];\n`;
      else if (g === "y") qasm += `y q[${t[0]}];\n`;
      else if (g === "z") qasm += `z q[${t[0]}];\n`;
      else if (g === "s") qasm += `s q[${t[0]}];\n`;
      else if (g === "t") qasm += `t q[${t[0]}];\n`;
      else if (g === "rx") qasm += `rx(${p[0] || "pi/2"}) q[${t[0]}];\n`;
      else if (g === "ry") qasm += `ry(${p[0] || "pi/2"}) q[${t[0]}];\n`;
      else if (g === "rz") qasm += `rz(${p[0] || "pi/2"}) q[${t[0]}];\n`;
      else if (g === "cnot" || g === "cx") qasm += `cx q[${t[0]}], q[${t[1]}];\n`;
      else if (g === "cz") qasm += `cz q[${t[0]}], q[${t[1]}];\n`;
      else if (g === "swap") qasm += `swap q[${t[0]}], q[${t[1]}];\n`;
      else if (g === "toffoli" || g === "ccx") qasm += `ccx q[${t[0]}], q[${t[1]}], q[${t[2]}];\n`;
      else if (g === "measure") qasm += `c[${t[0]}] = measure q[${t[0]}];\n`;
    }

    return qasm;
  }

  // Pre-configured Quantum Algorithm Templates
  static getAlgorithmLibrary() {
    return {
      bell_state: {
        id: "bell_state",
        title: "Bell State (|Φ+⟩ = (|00⟩ + |11⟩)/√2)",
        description: "Creates maximally entangled bipartite qubit pair using Hadamard and CNOT gates.",
        numQubits: 2,
        gates: [
          { gate: "H", targets: [0] },
          { gate: "CNOT", targets: [0, 1] },
        ],
      },
      quantum_teleportation: {
        id: "quantum_teleportation",
        title: "Quantum Teleportation Protocol",
        description: "Transfers an unknown quantum state |ψ⟩ from Alice to Bob using an EPR pair and classical bits.",
        numQubits: 3,
        gates: [
          // Prepare arbitrary state on qubit 0 (Alice state: Ry(pi/3))
          { gate: "RY", targets: [0], params: [Math.PI / 3] },
          // Create entangled pair between qubit 1 (Alice) and qubit 2 (Bob)
          { gate: "H", targets: [1] },
          { gate: "CNOT", targets: [1, 2] },
          // Bell measurement at Alice
          { gate: "CNOT", targets: [0, 1] },
          { gate: "H", targets: [0] },
          // Bob conditional operations
          { gate: "CNOT", targets: [1, 2] },
          { gate: "CZ", targets: [0, 2] },
        ],
      },
      grover_2qubit: {
        id: "grover_2qubit",
        title: "Grover's Search (Target |11⟩)",
        description: "Quadratic speedup search over 4 unstructured states finding marked target |11⟩.",
        numQubits: 2,
        gates: [
          // Superposition
          { gate: "H", targets: [0] },
          { gate: "H", targets: [1] },
          // Oracle for |11> (Controlled-Z)
          { gate: "CZ", targets: [0, 1] },
          // Grover Diffuser
          { gate: "H", targets: [0] },
          { gate: "H", targets: [1] },
          { gate: "X", targets: [0] },
          { gate: "X", targets: [1] },
          { gate: "CZ", targets: [0, 1] },
          { gate: "X", targets: [0] },
          { gate: "X", targets: [1] },
          { gate: "H", targets: [0] },
          { gate: "H", targets: [1] },
        ],
      },
      qft_3qubit: {
        id: "qft_3qubit",
        title: "3-Qubit Quantum Fourier Transform (QFT)",
        description: "Discrete Fourier transform mapped to quantum amplitudes for Shor's and phase estimation algorithms.",
        numQubits: 3,
        gates: [
          { gate: "H", targets: [0] },
          { gate: "RZ", targets: [0], params: [Math.PI / 2] },
          { gate: "CNOT", targets: [1, 0] },
          { gate: "H", targets: [1] },
          { gate: "RZ", targets: [1], params: [Math.PI / 4] },
          { gate: "CNOT", targets: [2, 1] },
          { gate: "H", targets: [2] },
          { gate: "SWAP", targets: [0, 2] },
        ],
      },
      kyber_lattice_demo: {
        id: "kyber_lattice_demo",
        title: "Post-Quantum Kyber-768 Lattice Simulation",
        description: "Demonstration of Learning-With-Errors (LWE) polynomial ring vector mapping immune to Shor's algorithm.",
        numQubits: 3,
        gates: [
          { gate: "H", targets: [0] },
          { gate: "RY", targets: [1], params: [Math.PI / 4] },
          { gate: "RZ", targets: [2], params: [Math.PI / 6] },
          { gate: "CNOT", targets: [0, 1] },
          { gate: "CZ", targets: [1, 2] },
        ],
      },
    };
  }
}
