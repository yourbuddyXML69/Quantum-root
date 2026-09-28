import React, { useState, useEffect } from 'react';
import { Shield, Flag, Terminal, Activity, AlertOctagon, HelpCircle, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { apiGetCTFChallenges, apiSubmitFlag, apiGetSIEMEvents, apiGetThreatIntel } from '../../lib/api';

export const CyberRangeView: React.FC = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [siemEvents, setSiemEvents] = useState<any[]>([]);
  const [threatIntel, setThreatIntel] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [submittedFlag, setSubmittedFlag] = useState<string>('');
  const [flagFeedback, setFlagFeedback] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'ctf' | 'siem' | 'intel'>('ctf');

  useEffect(() => {
    loadData();
    // Poll SIEM events periodically to emulate live SOC stream
    const interval = setInterval(() => {
      apiGetSIEMEvents(8).then((res) => setSiemEvents(res.events)).catch(() => {});
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [cRes, sRes, tRes] = await Promise.all([
        apiGetCTFChallenges(),
        apiGetSIEMEvents(8),
        apiGetThreatIntel(),
      ]);
      setChallenges(cRes.challenges);
      setSiemEvents(sRes.events);
      setThreatIntel(tRes.advisories);
      if (cRes.challenges.length > 0 && !selectedChallenge) {
        setSelectedChallenge(cRes.challenges[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !submittedFlag.trim()) return;

    try {
      const res = await apiSubmitFlag(selectedChallenge.id, submittedFlag.trim());
      setFlagFeedback(res);
      if (res.isCorrect) {
        // update solve count locally
        setChallenges((prev) =>
          prev.map((c) => (c.id === selectedChallenge.id ? { ...c, solveCount: c.solveCount + 1 } : c))
        );
      }
    } catch (err: any) {
      setFlagFeedback({ isCorrect: false, message: err.message });
    }
  };

  const filteredChallenges = challenges.filter(
    (c) => categoryFilter === 'ALL' || c.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Shield className="w-6 h-6 text-emerald-400" />
            Ethical Cybersecurity Range & SOC Operations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sandboxed ethical CTFs, quantum-safe crypto challenges, and live SIEM log telemetry with MITRE ATT&CK mapping.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('ctf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'ctf'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-700/80 shadow-glow-green'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            CTF Challenges
          </button>
          <button
            onClick={() => setActiveSubTab('siem')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'siem'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-700/80 shadow-glow-green'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Live SIEM Telemetry
          </button>
          <button
            onClick={() => setActiveSubTab('intel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'intel'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-700/80 shadow-glow-green'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Threat Intel & CVEs
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: CTF CHALLENGES */}
      {activeSubTab === 'ctf' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Selector Column */}
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              {['ALL', 'POST_QUANTUM_CRYPTO', 'FORENSICS', 'AI_RED_TEAMING', 'WEB_SECURITY', 'REVERSE_ENGINEERING'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 text-[10px] font-mono rounded-md font-semibold transition ${
                    categoryFilter === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
              {filteredChallenges.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedChallenge(c);
                    setFlagFeedback(null);
                    setSubmittedFlag('');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedChallenge?.id === c.id
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-glow-green'
                      : 'bg-[#0D121B] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{c.title}</span>
                    <span className="text-xs font-mono font-extrabold text-emerald-400">+{c.points} PTS</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{c.category}</span>
                    <span>{c.difficulty}</span>
                    <span>• {c.solveCount} Solves</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge Workspace Column */}
          {selectedChallenge && (
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{selectedChallenge.title}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {selectedChallenge.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Category: {selectedChallenge.category} • First Blood: {selectedChallenge.firstBloodUser || 'Unclaimed'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono font-extrabold text-emerald-400">
                      {selectedChallenge.points} <span className="text-xs text-slate-400">PTS</span>
                    </div>
                  </div>
                </div>

                {/* Scenario Briefing */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Mission Briefing & Threat Scenario
                  </span>
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                    <p>{selectedChallenge.scenario}</p>
                    <p className="text-slate-400 italic">{selectedChallenge.description}</p>
                  </div>
                </div>

                {/* Hints */}
                {selectedChallenge.hints && selectedChallenge.hints.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Hints Available:
                    </span>
                    <div className="space-y-1.5">
                      {selectedChallenge.hints.map((h: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300/90">
                          💡 Hint {idx + 1}: {h.hint} (Penalty: -{h.penalty} pts)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flag Submission Form */}
                <form onSubmit={handleSubmitFlag} className="pt-2 border-t border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-emerald-400" /> Submit Target Flag:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={submittedFlag}
                      onChange={(e) => setSubmittedFlag(e.target.value)}
                      placeholder="ROOT{category_secret_flag_hash}"
                      className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-4 py-2.5 font-mono text-emerald-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition shadow-glow-green"
                    >
                      Submit Flag
                    </button>
                  </div>

                  {flagFeedback && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-mono ${
                        flagFeedback.isCorrect
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 shadow-glow-green'
                          : 'bg-rose-950/60 border-rose-600 text-rose-300'
                      }`}
                    >
                      {flagFeedback.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: LIVE SIEM DASHBOARD */}
      {activeSubTab === 'siem' && (
        <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live SOC Telemetry Stream (Suricata / Zeek / MITRE Engine)</h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              BUFFER: REAL-TIME (ACTIVE)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Source & Destination</th>
                  <th className="py-2.5 px-3">Protocol</th>
                  <th className="py-2.5 px-3">MITRE ATT&CK</th>
                  <th className="py-2.5 px-3">Event Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {siemEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          evt.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : evt.severity === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {evt.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {evt.sourceIp} → {evt.destIp}
                    </td>
                    <td className="py-2 px-3 text-cyan-400">{evt.protocol}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        {evt.mitreTechnique}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-200">{evt.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: THREAT INTEL RADAR */}
      {activeSubTab === 'intel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {threatIntel.map((item) => (
            <div key={item.id} className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400">{item.cveId}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  {item.severity}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
              <p className="text-xs text-slate-400">{item.summary}</p>
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                <div className="text-cyan-400 font-mono text-[11px]">PQC Context: {item.pqcRelevance}</div>
                <div className="text-emerald-400 font-mono text-[11px]">Remediation: {item.remediation}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
