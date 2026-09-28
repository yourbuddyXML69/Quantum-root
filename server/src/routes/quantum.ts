// Quantum Computing Hub API Routes
import { Router } from "express";
import { QuantumSimulatorService, GateInstruction } from "../quantum/simulator";

const router = Router();

// Run Circuit Simulation
router.post("/simulate", (req, res) => {
  try {
    const { numQubits = 2, gates = [], shots = 1024, circuitName } = req.body;

    if (!Array.isArray(gates)) {
      return res.status(400).json({ error: "Gates parameter must be an array of gate instructions." });
    }

    if (numQubits < 1 || numQubits > 16) {
      return res.status(400).json({ error: "numQubits must be between 1 and 16 for exact state-vector simulation." });
    }

    const result = QuantumSimulatorService.simulate(numQubits, gates as GateInstruction[], shots);
    result.circuitName = circuitName || `Quantum Circuit (${numQubits} Qubits, ${gates.length} Gates)`;

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to simulate quantum circuit." });
  }
});

// Algorithm Library
router.get("/algorithms", (req, res) => {
  const library = QuantumSimulatorService.getAlgorithmLibrary();
  return res.json({
    count: Object.keys(library).length,
    algorithms: library,
  });
});

// Transpile to OpenQASM, Qiskit, or Cirq
router.post("/transpile", (req, res) => {
  try {
    const { numQubits = 2, gates = [], targetFormat = "openqasm" } = req.body;
    const qasm = QuantumSimulatorService.toOpenQASM(numQubits, gates as GateInstruction[]);

    let code = qasm;
    if (targetFormat === "qiskit") {
      code = `# Qiskit 1.0+ Implementation\nfrom qiskit import QuantumCircuit\n\nqc = QuantumCircuit(${numQubits}, ${numQubits})\n`;
      for (const g of gates) {
        const name = g.gate.toLowerCase();
        const t = g.targets;
        if (name === "h") code += `qc.h(${t[0]})\n`;
        else if (name === "x") code += `qc.x(${t[0]})\n`;
        else if (name === "z") code += `qc.z(${t[0]})\n`;
        else if (name === "cnot" || name === "cx") code += `qc.cx(${t[0]}, ${t[1]})\n`;
      }
      code += `qc.measure_all()\n`;
    } else if (targetFormat === "pennylane") {
      code = `# PennyLane Implementation\nimport pennylane as qml\n\ndev = qml.device('default.qubit', wires=${numQubits})\n\n@qml.qnode(dev)\ndef circuit():\n`;
      for (const g of gates) {
        const name = g.gate.toLowerCase();
        const t = g.targets;
        if (name === "h") code += `    qml.Hadamard(wires=${t[0]})\n`;
        else if (name === "cnot" || name === "cx") code += `    qml.CNOT(wires=[${t[0]}, ${t[1]}])\n`;
      }
      code += `    return qml.probs(wires=range(${numQubits}))\n`;
    }

    return res.json({ targetFormat, code, qasm });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Hardware Provider Status
router.get("/providers", (req, res) => {
  return res.json({
    providers: [
      {
        id: "ibm-heron",
        name: "IBM Quantum Heron r2",
        type: "Superconducting Transmon",
        qubits: 133,
        status: "ONLINE",
        quantumVolume: 512,
        queueLength: 14,
        avgWaitTimeMin: 6.2,
      },
      {
        id: "braket-rigetti",
        name: "Amazon Braket Rigetti Ankaa-2",
        type: "Superconducting",
        qubits: 84,
        status: "ONLINE",
        quantumVolume: 256,
        queueLength: 5,
        avgWaitTimeMin: 2.1,
      },
      {
        id: "azure-ionq",
        name: "Azure Quantum IonQ Forte",
        type: "Trapped Ion",
        qubits: 36,
        status: "CALIBRATING",
        quantumVolume: 1024,
        queueLength: 22,
        avgWaitTimeMin: 18.0,
      },
      {
        id: "internal-simulator",
        name: "Quantoom Local State-Vector Simulator",
        type: "High-Performance Classical Node",
        qubits: 16,
        status: "READY",
        quantumVolume: "N/A (Exact)",
        queueLength: 0,
        avgWaitTimeMin: 0,
      },
    ],
  });
});

export default router;
