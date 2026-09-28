import React from 'react';
import { Atom, Shield, Bot, Cpu, Sparkles, Terminal, Trophy, KeyRound } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pqcActive: boolean;
  onTriggerPQC: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, pqcActive, onTriggerPQC }) => {
  const navItems = [
    { id: 'community', label: 'Community Hub', icon: Sparkles, color: 'text-cyan-400' },
    { id: 'quantum', label: 'Quantum Lab', icon: Atom, color: 'text-cyan-400' },
    { id: 'ai', label: 'AI Copilot', icon: Bot, color: 'text-purple-400' },
    { id: 'cyber', label: 'Cyber Range', icon: Shield, color: 'text-emerald-400' },
    { id: 'convergence', label: 'Projects & Bounties', icon: Cpu, color: 'text-amber-400' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: 'text-yellow-400' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080B10]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('community')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-glow-blue">
            <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
              <Atom className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                QUANTOOM
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                ROOT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider font-mono">QUANTUM • AI • CYBER</p>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 border border-slate-800/60 rounded-full px-3 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? item.color : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Actions */}
        <div className="flex items-center space-x-2.5">
          {/* PQC Security Badge */}
          <button
            onClick={onTriggerPQC}
            title="Click to perform NIST FIPS 203 ML-KEM Post-Quantum Key Exchange"
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              pqcActive
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-glow-green'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <KeyRound className="w-3 h-3 text-emerald-400" />
            <span>PQC: ML-KEM-768</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 p-[1px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-mono font-bold text-cyan-300">
                Ω
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-none text-slate-200">dr_elena</p>
              <p className="text-[10px] text-cyan-400/80 font-mono">2,840 REP</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
