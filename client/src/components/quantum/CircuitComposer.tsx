import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Server, Sparkles, BookOpen, Layers, Activity } from 'lucide-react';
import { apiSimulateCircuit, apiGetAlgorithms, apiGetProviders } from '../../lib/api';

interface GateItem {
  gate: string;
  targets: number[];
  params?: number[];
}

export const CircuitComposer: React.FC = () => {
  const [numQubits, setNumQubits] = useState<number>(2);
  const [gates, setGates] = useState<GateItem[]>([
    { gate: 'H', targets: [0] },
    { gate: 'CNOT', targets: [0, 1] },
  ]);
  const [selectedWire, setSelectedWire] = useState<number>(0);
  const [targetWire, setTargetWire] = useState<number>(1);
  const [shots, setShots] = useState<number>(1024);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [algorithms, setAlgorithms] = useState<any>({});
  const [providers, setProviders] = useState<any[]>([]);
  const [copiedQasm, setCopiedQasm] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'bloch' | 'statevector' | 'histogram' | 'qasm'>('bloch');

  // Available Gate Palette
  const gatePalette = [
    { name: 'H', desc: 'Hadamard (Superposition)', color: 'bg-cyan-600 hover:bg-cyan-500' },
    { name: 'X', desc: 'Pauli-X (NOT / Bit Flip)', color: 'bg-emerald-600 hover:bg-emerald-500' },
    { name: 'Y', desc: 'Pauli-Y (Bit & Phase Flip)', color: 'bg-teal-600 hover:bg-teal-500' },
    { name: 'Z', desc: 'Pauli-Z (Phase Flip)', color: 'bg-purple-600 hover:bg-purple-500' },
    { name: 'S', desc: 'S Phase (π/2)', color: 'bg-indigo-600 hover:bg-indigo-500' },
    { name: 'T', desc: 'T Gate (π/4)', color: 'bg-violet-600 hover:bg-violet-500' },
    { name: 'RX', desc: 'X-Rotation (π/2)', color: 'bg-blue-600 hover:bg-blue-500' },
    { name: 'RY', desc: 'Y-Rotation (π/2)', color: 'bg-sky-600 hover:bg-sky-500' },
    { name: 'RZ', desc: 'Z-Rotation (π/2)', color: 'bg-fuchsia-600 hover:bg-fuchsia-500' },
    { name: 'CNOT', desc: 'Controlled-NOT', color: 'bg-amber-600 hover:bg-amber-500', multi: true },
    { name: 'CZ', desc: 'Controlled-Z', color: 'bg-orange-600 hover:bg-orange-500', multi: true },
    { name: 'SWAP', desc: 'Swap Two Qubits', color: 'bg-pink-600 hover:bg-pink-500', multi: true },
    { name: 'MEASURE', desc: 'Measurement in Z', color: 'bg-rose-700 hover:bg-rose-600' },
  ];

  // Load initial algorithms and providers
  useEffect(() => {
    apiGetAlgorithms().then((res) => setAlgorithms(res.algorithms)).catch(() => {});
    apiGetProviders().then((res) => setProviders(res.providers)).catch(() => {});
    handleRunSimulation();
  }, []);

  const handleAddGate = (gateName: string) => {
    let newGate: GateItem;
    if (['CNOT', 'CZ', 'SWAP'].includes(gateName)) {
      if (selectedWire === targetWire) {
        alert('Control and target qubits must be distinct.');
        return;
      }
      newGate = { gate: gateName, targets: [selectedWire, targetWire] };
    } else {
      newGate = { gate: gateName, targets: [selectedWire] };
    }
    setGates([...gates, newGate]);
  };

  const handleRemoveGate = (index: number) => {
    setGates(gates.filter((_, i) => i !== index));
  };

  const handleClearCircuit = () => {
    setGates([]);
    setSimulationResult(null);
  };

  const handleLoadAlgorithm = (algoKey: string) => {
    const algo = algorithms[algoKey];
    if (algo) {
      setNumQubits(algo.numQubits);
      setGates(algo.gates);
      setSelectedWire(0);
      setTargetWire(algo.numQubits > 1 ? 1 : 0);
    }
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await apiSimulateCircuit(numQubits, gates, shots);
      setSimulationResult(res);
    } catch (err: any) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQasm = () => {
    if (simulationResult?.openQasm) {
      navigator.clipboard.writeText(simulationResult.openQasm);
      setCopiedQasm(true);
      setTimeout(() => setCopiedQasm(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Templates */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">⚛️</span>
            Interactive Quantum Circuit Workbench
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full unitary state-vector evolution, Bloch sphere coordinates, OpenQASM 3.0 transpile, and hardware dispatcher.
          </p>
        </div>

        {/* Algorithm Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Presets:
          </span>
          <button
            onClick={() => handleLoadAlgorithm('bell_state')}
            className="px-2.5 py-1 text-xs rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 font-medium transition"
          >
            Bell State |Φ+⟩
          </button>
          <button
            onClick={() => handleLoadAlgorithm('grover_2qubit')}
            className="px-2.5 py-1 text-xs rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-800/80 text-purple-300 font-medium transition"
          >
            Grover (Target |11⟩)
          </button>
          <button
            onClick={() => handleLoadAlgorithm('quantum_teleportation')}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 font-medium transition"
          >
            Teleportation (3Q)
          </button>
          <button
            onClick={() => handleLoadAlgorithm('qft_3qubit')}
            className="px-2.5 py-1 text-xs rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-800/80 text-amber-300 font-medium transition"
          >
            3-Qubit QFT
          </button>
          <button
            onClick={() => handleLoadAlgorithm('kyber_lattice_demo')}
            className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 font-medium transition"
          >
            PQC Kyber Lattice Demo
          </button>
        </div>
      </div>

      {/* Circuit Grid & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Circuit Editor */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <label className="text-xs text-slate-300 font-medium">Qubits:</label>
                <select
                  value={numQubits}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setNumQubits(q);
                    // Prune gates that target out-of-range qubits
                    setGates(gates.filter((g) => g.targets.every((t) => t < q)));
                  }}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-cyan-300 font-mono focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} Qubits ({1 << n} States)
                    </option>
                  ))}
                </select>

                <div className="h-4 w-px bg-slate-800"></div>

                <label className="text-xs text-slate-300 font-medium">Shots:</label>
                <select
                  value={shots}
                  onChange={(e) => setShots(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-300 font-mono focus:outline-none"
                >
                  <option value={512}>512</option>
                  <option value={1024}>1024</option>
                  <option value={4096}>4096</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearCircuit}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleRunSimulation}
                  disabled={loading}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-glow-blue transition disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{loading ? 'Simulating...' : 'Simulate Circuit'}</span>
                </button>
              </div>
            </div>

            {/* Qubit Rails View */}
            <div className="space-y-4 py-2 overflow-x-auto">
              {Array.from({ length: numQubits }).map((_, qIndex) => (
                <div key={qIndex} className="flex items-center space-x-3 min-w-[500px]">
                  {/* Qubit Label */}
                  <div
                    onClick={() => setSelectedWire(qIndex)}
                    className={`w-14 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold cursor-pointer transition border ${
                      selectedWire === qIndex
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-glow-blue'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    |q{qIndex}⟩
                  </div>

                  {/* Rail Wire with Gates */}
                  <div className="flex-1 h-9 relative flex items-center bg-slate-950/40 border border-slate-900 rounded-lg px-2">
                    {/* Center wire line */}
                    <div className="absolute inset-x-0 top-1/2 h-[2px] bg-slate-800 -translate-y-1/2"></div>

                    {/* Gates placed on this circuit */}
                    <div className="relative z-10 flex items-center space-x-2">
                      {gates.map((g, gIdx) => {
                        const isTarget = g.targets.includes(qIndex);
                        if (!isTarget) {
                          return (
                            <div key={gIdx} className="w-9 h-7 flex items-center justify-center">
                              {/* Spacer or connector for multi-qubit */}
                              {g.targets.length > 1 &&
                              qIndex > Math.min(...g.targets) &&
                              qIndex < Math.max(...g.targets) ? (
                                <div className="w-0.5 h-full bg-cyan-500/60"></div>
                              ) : null}
                            </div>
                          );
                        }

                        const isControl = g.targets.length > 1 && g.targets[0] === qIndex;
                        const isSecondTarget = g.targets.length > 1 && g.targets[1] === qIndex;

                        return (
                          <div
                            key={gIdx}
                            onClick={() => handleRemoveGate(gIdx)}
                            title="Click to remove gate"
                            className={`w-9 h-7 rounded flex items-center justify-center font-mono text-xs font-bold cursor-pointer transition shadow hover:scale-105 ${
                              isControl
                                ? 'bg-cyan-500 text-black border border-cyan-300'
                                : isSecondTarget
                                ? 'bg-purple-600 text-white border border-purple-400'
                                : 'bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-rose-900'
                            }`}
                          >
                            {isControl ? '●' : isSecondTarget ? '⊕' : g.gate}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gate Palette Toolbox */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Gate Toolbox (Click to apply to wire |q{selectedWire}⟩):</span>
                {numQubits > 1 && (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Target Wire:</span>
                    <select
                      value={targetWire}
                      onChange={(e) => setTargetWire(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 text-xs rounded px-1.5 py-0.5 text-purple-300 font-mono"
                    >
                      {Array.from({ length: numQubits }).map((_, i) => (
                        <option key={i} value={i} disabled={i === selectedWire}>
                          |q{i}⟩
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {gatePalette.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => handleAddGate(g.name)}
                    title={g.desc}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white transition shadow-sm ${g.color}`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Simulation Output Dashboard */}
          {simulationResult && (
            <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Execution: {simulationResult.executionTimeMs} ms
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {simulationResult.numQubits} Qubits • {shots} Shots
                  </span>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
                  <button
                    onClick={() => setActiveSubTab('bloch')}
                    className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                      activeSubTab === 'bloch' ? 'bg-cyan-900/60 text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Bloch Spheres
                  </button>
                  <button
                    onClick={() => setActiveSubTab('statevector')}
                    className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                      activeSubTab === 'statevector' ? 'bg-cyan-900/60 text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    State Vector
                  </button>
                  <button
                    onClick={() => setActiveSubTab('histogram')}
                    className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                      activeSubTab === 'histogram' ? 'bg-cyan-900/60 text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Histogram
                  </button>
                  <button
                    onClick={() => setActiveSubTab('qasm')}
                    className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                      activeSubTab === 'qasm' ? 'bg-cyan-900/60 text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    OpenQASM 3.0
                  </button>
                </div>
              </div>

              {/* View 1: Bloch Sphere Coordinates & Polar Vector */}
              {activeSubTab === 'bloch' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {simulationResult.blochAngles.map((b: any) => {
                    const { x, y, z } = b.coordinates;
                    return (
                      <div key={b.qubit} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-xs font-mono font-bold text-cyan-400 mb-2">Qubit |q{b.qubit}⟩ Bloch Vector</span>
                        
                        {/* 2D Projected Bloch Circle */}
                        <div className="relative w-28 h-28 rounded-full border border-cyan-500/40 flex items-center justify-center bg-slate-950/60 shadow-inner">
                          {/* Equator & Axis */}
                          <div className="absolute inset-x-0 top-1/2 h-px bg-slate-700"></div>
                          <div className="absolute inset-y-0 left-1/2 w-px bg-slate-700"></div>
                          
                          {/* Pole labels */}
                          <span className="absolute top-1 text-[9px] font-mono text-slate-400">|0⟩ (+z)</span>
                          <span className="absolute bottom-1 text-[9px] font-mono text-slate-400">|1⟩ (-z)</span>
                          <span className="absolute right-1 text-[9px] font-mono text-slate-400">|+⟩</span>

                          {/* Projected State Vector Indicator */}
                          <div
                            className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-glow-blue"
                            style={{
                              transform: `translate(${x * 45}px, ${-z * 45}px)`,
                            }}
                          ></div>
                          {/* Vector Line */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line
                              x1="56"
                              y1="56"
                              x2={56 + x * 45}
                              y2={56 - z * 45}
                              stroke="#00E5FF"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>

                        {/* Coordinates display */}
                        <div className="mt-3 text-[11px] font-mono space-y-0.5 text-center text-slate-300">
                          <div>θ = {(b.theta).toFixed(3)} rad • φ = {(b.phi).toFixed(3)} rad</div>
                          <div className="text-slate-400 text-[10px]">
                            ⟨X⟩={x} ⟨Y⟩={y} ⟨Z⟩={z}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: State Vector Amplitudes */}
              {activeSubTab === 'statevector' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Basis State</th>
                        <th className="py-2 px-3">Real Amplitude</th>
                        <th className="py-2 px-3">Imag Amplitude</th>
                        <th className="py-2 px-3">Probability |c|²</th>
                        <th className="py-2 px-3">Distribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {simulationResult.stateVector.map((entry: any) => (
                        <tr key={entry.basis} className="hover:bg-slate-900/40">
                          <td className="py-2 px-3 font-bold text-cyan-300">{entry.basis}</td>
                          <td className="py-2 px-3 text-slate-300">{entry.real}</td>
                          <td className="py-2 px-3 text-slate-300">{entry.imag}</td>
                          <td className="py-2 px-3 font-semibold text-emerald-400">{(entry.probability * 100).toFixed(2)}%</td>
                          <td className="py-2 px-3 w-48">
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all"
                                style={{ width: `${entry.probability * 100}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* View 3: Histogram */}
              {activeSubTab === 'histogram' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(simulationResult.measurements).map(([basis, count]: [string, any]) => {
                      const pct = ((count / shots) * 100).toFixed(1);
                      return (
                        <div key={basis} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-mono font-bold text-cyan-300">|{basis}⟩</span>
                            <span className="font-mono text-emerald-400">{count} shots ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-[1px]">
                            <div
                              className="bg-cyan-500 h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 4: OpenQASM 3.0 Export */}
              {activeSubTab === 'qasm' && (
                <div className="relative">
                  <button
                    onClick={handleCopyQasm}
                    className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700"
                  >
                    {copiedQasm ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQasm ? 'Copied' : 'Copy QASM'}</span>
                  </button>
                  <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                    {simulationResult.openQasm}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Hardware Providers Status */}
        <div className="space-y-4">
          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold flex items-center gap-2 text-white">
              <Server className="w-4 h-4 text-purple-400" />
              Hardware Dispatcher
            </h3>
            <p className="text-xs text-slate-400">
              Execute validated circuits directly on physical quantum processors or high-performance simulators.
            </p>

            <div className="space-y-3">
              {providers.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{p.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        p.status === 'ONLINE' || p.status === 'READY'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>{p.type}</span>
                    <span className="font-mono text-cyan-400">{p.qubits} Qubits</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                    <span>Queue: {p.queueLength} jobs</span>
                    <span>Wait: ~{p.avgWaitTimeMin}m</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Real Hardware Dispatch: Connect your IBM Quantum or AWS Braket API key in Settings.')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            >
              Configure Provider API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
