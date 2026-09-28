import React, { useState, useEffect } from 'react';
import { Cpu, DollarSign, Users, Github, CheckSquare, Plus, ExternalLink } from 'lucide-react';
import { apiGetProjects } from '../../lib/api';

export const ConvergenceProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    apiGetProjects().then((res) => setProjects(res.projects)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Cpu className="w-6 h-6 text-amber-400" />
            Convergence Projects & Sponsored Bounties
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-disciplinary collaborative research initiatives combining Quantum Circuits, Machine Learning Models, and Post-Quantum Defensive Architecture.
          </p>
        </div>

        <button
          onClick={() => alert('New Convergence Project: You can propose a new hackathon challenge or bounty workspace.')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Convergence Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const progressPct = Math.round((proj.tasksCompleted / proj.totalTasks) * 100);
          return (
            <div
              key={proj.id}
              className="bg-[#0D121B] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {proj.domains.map((d: string) => (
                      <span
                        key={d}
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          d === 'QUANTUM'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                            : d === 'AI'
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-white">{proj.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-emerald-400 flex items-center gap-0.5 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                    <DollarSign className="w-3.5 h-3.5" />
                    {proj.bountyUsd.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-cyan-400" /> Milestone Tasks
                  </span>
                  <span>
                    {proj.tasksCompleted} / {proj.totalTasks} ({progressPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-[1px] border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Meta & Actions */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Users className="w-3.5 h-3.5 text-purple-400" /> {proj.teamSize} Contributors
                  </span>
                  {proj.githubRepo && (
                    <span className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer font-mono">
                      <Github className="w-3.5 h-3.5" /> {proj.githubRepo}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => alert(`Joined project workspace: ${proj.title}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 transition flex items-center gap-1"
                >
                  <span>Contribute</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
