import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowBigUp, CheckCircle, Tag, Plus, Filter, Sparkles, UserCheck } from 'lucide-react';
import { apiGetFeed, apiCreatePost, apiUpvotePost, apiAddComment } from '../../lib/api';

export const CommunityView: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newDomain, setNewDomain] = useState<string>('QUANTUM');
  const [isQuestion, setIsQuestion] = useState<boolean>(false);
  const [newTags, setNewTags] = useState<string>('Qiskit, Simulation');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  useEffect(() => {
    loadFeed();
  }, [selectedDomain]);

  const loadFeed = async () => {
    try {
      const res = await apiGetFeed(selectedDomain === 'ALL' ? undefined : selectedDomain);
      setPosts(res.posts);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      const res = await apiUpvotePost(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, upvotes: res.post.upvotes } : p)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const tags = newTags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await apiCreatePost({
        title: newTitle,
        content: newContent,
        domain: newDomain,
        isQuestion,
        tags,
      });
      setPosts([res.post, ...posts]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
    } catch (e) {
      alert('Failed to publish post.');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      await apiAddComment(postId, commentText);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
      );
      setCommentText('');
      setActiveCommentPostId(null);
    } catch (e) {
      alert('Failed to submit comment.');
    }
  };

  const domainTabs = [
    { id: 'ALL', label: 'All Channels', color: 'border-slate-700' },
    { id: 'QUANTUM', label: '⚛️ Quantum Hub', color: 'border-cyan-500 text-cyan-300' },
    { id: 'AI', label: '🤖 AI Knowledge', color: 'border-purple-500 text-purple-300' },
    { id: 'CYBERSECURITY', label: '🛡️ Cyber Range', color: 'border-emerald-500 text-emerald-300' },
    { id: 'CONVERGENCE', label: '⚡ Convergence', color: 'border-amber-500 text-amber-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Feed Filter Bar & New Post Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        {/* Domain Tabs */}
        <div className="flex flex-wrap gap-2">
          {domainTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedDomain(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                selectedDomain === t.id
                  ? 'bg-slate-800 text-white shadow-sm border-slate-600'
                  : 'bg-slate-950/60 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-glow-blue"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion or Question</span>
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#0D121B] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition space-y-3 shadow-xl"
          >
            {/* Header: Author + Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img src={post.author.avatarUrl} alt="" className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200">{post.author.displayName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      {post.author.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {post.author.role} • {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Channel Tag */}
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  post.domain === 'QUANTUM'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    : post.domain === 'AI'
                    ? 'bg-purple-950 text-purple-300 border-purple-800'
                    : post.domain === 'CYBERSECURITY'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                /{post.domain.toLowerCase()}
              </span>
            </div>

            {/* Post Title & Content */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                {post.isQuestion && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                    Q&A
                  </span>
                )}
                <h3 className="text-base font-bold text-white hover:text-cyan-300 cursor-pointer transition">
                  {post.title}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((t: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5 text-slate-500" /> {t}
                </span>
              ))}
            </div>

            {/* Footer Actions: Upvote, Comment, Solved */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-cyan-400 border border-slate-800 transition font-mono"
                >
                  <ArrowBigUp className="w-4 h-4 fill-current" />
                  <span>{post.upvotes}</span>
                </button>
                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center space-x-1 hover:text-slate-200 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} comments</span>
                </button>
              </div>

              {post.acceptedAnswerId && (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Accepted Answer</span>
                </span>
              )}
            </div>

            {/* Quick Comment Drawer */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 border-t border-slate-800/80 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a constructive response or peer review..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono transition"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Create Research Post or Question
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Channel / Domain</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 mt-1"
                >
                  <option value="QUANTUM">⚛️ Quantum Computing</option>
                  <option value="AI">🤖 Artificial Intelligence</option>
                  <option value="CYBERSECURITY">🛡️ Cybersecurity</option>
                  <option value="CONVERGENCE">⚡ Convergence (Quantum + AI + Cyber)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Post Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Benchmarking VQE with Noise Mitigation on IBM Heron"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 mt-1 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Content (Markdown & LaTeX supported)</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share code, circuit equations ($|\psi\rangle$), or benchmarks..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 mt-1 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Qiskit, VQE, ErrorMitigation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 mt-1"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isQ"
                  checked={isQuestion}
                  onChange={(e) => setIsQuestion(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500"
                />
                <label htmlFor="isQ" className="text-xs text-slate-300">
                  Mark as Q&A Question (allows accepted answers and bounty points)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-glow-blue"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
