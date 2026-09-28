import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CircuitComposer } from './components/quantum/CircuitComposer';
import { AICopilotView } from './components/ai/AICopilotView';
import { CyberRangeView } from './components/cyber/CyberRangeView';
import { CommunityView } from './components/community/CommunityView';
import { LeaderboardView } from './components/community/LeaderboardView';
import { ConvergenceProjectsView } from './components/community/ConvergenceProjectsView';
import { apiGetStats, apiPQCHandshake } from './lib/api';
import { ShieldCheck, Atom, Bot, Shield, KeyRound, Sparkles, Terminal, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('community');
  const [stats, setStats] = useState<any>({
    activeMembers: 14280,
    quantumCircuitsSimulated: 98450,
    aiQueriesProcessed: 312500,
    ctfChallengesSolved: 18400,
    activeConvergenceProjects: 42,
    pqcMigrationProgressPct: 78.4,
  });
  const [pqcModalOpen, setPqcModalOpen] = useState<boolean>(false);
  const [pqcResult, setPqcResult] = useState<any>(null);
  const [pqcActive, setPqcActive] = useState<boolean>(true);

  useEffect(() => {
    apiGetStats().then((data) => setStats(data)).catch(() => {});
  }, []);

  const handleTriggerPQC = async () => {
    setPqcModalOpen(true);
    setPqcResult(null);
    try {
      const res = await apiPQCHandshake();
      setPqcResult(res);
      setPqcActive(true);
    } catch (e: any) {
      setPqcResult({ error: e.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col font-sans">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pqcActive={pqcActive}
        onTriggerPQC={handleTriggerPQC}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-[#0A0E17] to-[#080B10] py-8 px-4 sm:px-6 lg:px-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-800/80 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>NIST FIPS 203 & 204 POST-QUANTUM HARDENED</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Root access to the{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                quantum-AI-cyber frontier
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The unified collaborative ecosystem for quantum computing researchers, AI practitioners, and defensive cybersecurity engineers.
            </p>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Atom className="w-3 h-3 text-cyan-400" /> Circuits Run
              </div>
              <div className="text-lg font-mono font-bold text-white mt-0.5">
                {(stats.quantumCircuitsSimulated || 0).toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Bot className="w-3 h-3 text-purple-400" /> AI Queries
              </div>
              <div className="text-lg font-mono font-bold text-white mt-0.5">
                {(stats.aiQueriesProcessed || 0).toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> CTF Solves
              </div>
              <div className="text-lg font-mono font-bold text-white mt-0.5">
                {(stats.ctfChallengesSolved || 0).toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> PQC Progress
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                {stats.pqcMigrationProgressPct}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'quantum' && <CircuitComposer />}
        {activeTab === 'ai' && <AICopilotView />}
        {activeTab === 'cyber' && <CyberRangeView />}
        {activeTab === 'convergence' && <ConvergenceProjectsView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* Post-Quantum Cryptography Handshake Inspector Modal */}
      {pqcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPqcModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">NIST FIPS 203 (ML-KEM-768) Key Handshake</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Quantoom Root derives symmetric encryption keys using Module-Lattice Learning-With-Errors (ML-KEM-768), safeguarding all telemetry, quantum circuit parameters, and CTF flags against Shor's algorithm and Harvest-Now-Decrypt-Later attacks.
            </p>

            {pqcResult ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard:</span>
                  <span className="text-cyan-400 font-bold">{pqcResult.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-bold">{pqcResult.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Derived Session ID:</span>
                  <span className="text-purple-300">{pqcResult.derivedKeyId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Level:</span>
                  <span className="text-emerald-400">{pqcResult.quantumSecurityLevel}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-500">ML-KEM Ciphertext Snippet:</span>
                  <p className="text-slate-300 break-all">{pqcResult.ciphertextSnippet}</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 font-mono">
                Initiating module-lattice polynomial ring encapsulation...
              </div>
            )}

            <button
              onClick={() => setPqcModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-glow-green"
            >
              Verify & Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080B10] py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">QUANTOOM ROOT</span>
            <span>•</span>
            <span>v1.0.0-PROD</span>
            <span>•</span>
            <span className="text-emerald-400">NIST PQC STANDARDS COMPLIANT</span>
          </div>
          <div>Root access to the quantum-AI-cyber frontier. Open Research Standard.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
