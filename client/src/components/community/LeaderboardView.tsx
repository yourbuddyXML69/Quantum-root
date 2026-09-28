import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, Atom, Shield } from 'lucide-react';
import { apiGetLeaderboard } from '../../lib/api';

export const LeaderboardView: React.FC = () => {
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    apiGetLeaderboard().then((res) => setRankings(res.leaderboard)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Global Convergence Leaderboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Recognizing community members pushing the frontier in Quantum Algorithms, Adversarial AI, and Post-Quantum Security.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Season 4 Active</span>
        </div>
      </div>

      <div className="bg-[#0D121B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Domain Badge</th>
              <th className="py-3 px-4 text-center">CTFs Solved</th>
              <th className="py-3 px-4 text-center">Circuits Run</th>
              <th className="py-3 px-4 text-right">Reputation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rankings.map((user) => (
              <tr key={user.rank} className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-mono font-bold">
                  {user.rank === 1 ? (
                    <span className="flex items-center text-yellow-400 gap-1">
                      <Medal className="w-4 h-4 fill-current" /> #1
                    </span>
                  ) : user.rank === 2 ? (
                    <span className="flex items-center text-slate-300 gap-1">
                      <Medal className="w-4 h-4" /> #2
                    </span>
                  ) : user.rank === 3 ? (
                    <span className="flex items-center text-amber-600 gap-1">
                      <Medal className="w-4 h-4" /> #3
                    </span>
                  ) : (
                    <span className="text-slate-500">#{user.rank}</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 p-[1px]">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-mono text-[10px] text-cyan-300 font-bold">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{user.displayName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">@{user.username} • {user.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-cyan-400 border border-slate-800 text-[11px]">
                    {user.badge}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-emerald-400 font-bold">
                  {user.solvedCTFs}
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-cyan-400 font-bold">
                  {user.circuitsRun}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white text-sm">
                  {user.reputation} <span className="text-xs text-cyan-400 font-normal">pts</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
