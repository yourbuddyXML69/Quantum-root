import React, { useState } from 'react';
import { Bot, Send, ShieldAlert, FileText, CheckCircle2, AlertTriangle, ExternalLink, Cpu } from 'lucide-react';
import { apiSendAIChat, apiReviewCode, apiSummarizePaper } from '../../lib/api';

export const AICopilotView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'reviewer' | 'summarizer'>('chat');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');

  // Chat State
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      sender: 'ASSISTANT',
      content: `👋 **Welcome to the Quantoom Root AI Copilot!**\n\nI am your specialized RAG research assistant indexed over post-quantum cryptography standards (NIST FIPS 203/204), quantum algorithm papers, and ethical cybersecurity advisories.\n\nHow can I assist your research or code analysis today?`,
      model: 'gpt-4o',
      citations: [
        {
          title: 'NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism',
          sourceUrl: 'https://csrc.nist.gov/pubs/fips/203/final',
          relevanceScore: 0.98,
          snippet: 'Defines ML-KEM post-quantum key encapsulation standard.',
        },
      ],
    },
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Code Reviewer State
  const [codeSnippet, setCodeSnippet] = useState<string>(`import rsa
import os

# Legacy key generation vulnerable to Shor's Algorithm
(pubkey, privkey) = rsa.newkeys(2048)
api_secret = "sk_live_quantoom_secret_998271"

def process_quantum_job(command):
    # Potential command injection
    os.system("echo " + command)
`);
  const [codeReviewResult, setCodeReviewResult] = useState<any>(null);
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);

  // Paper Summarizer State
  const [paperTitle, setPaperTitle] = useState<string>('Quantum Computational Supremacy with Superconducting Qubits');
  const [paperAbstract, setPaperAbstract] = useState<string>(
    'The promise of quantum computers is that certain computational tasks might be executed exponentially faster on a quantum processor than on a classical processor...'
  );
  const [paperResult, setPaperResult] = useState<any>(null);
  const [paperLoading, setPaperLoading] = useState<boolean>(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setChatHistory((prev) => [...prev, { sender: 'USER', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await apiSendAIChat(userMsg, selectedModel);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ASSISTANT',
          content: res.response,
          model: res.modelUsed,
          citations: res.citations,
        },
      ]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ASSISTANT',
          content: `⚠️ Error processing query: ${err.message}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunCodeReview = async () => {
    setReviewLoading(true);
    try {
      const res = await apiReviewCode(codeSnippet, 'python');
      setCodeReviewResult(res);
    } catch (err: any) {
      alert(`Review error: ${err.message}`);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSummarizePaper = async () => {
    setPaperLoading(true);
    try {
      const res = await apiSummarizePaper(paperTitle, paperAbstract, '');
      setPaperResult(res);
    } catch (err: any) {
      alert(`Summarize error: ${err.message}`);
    } finally {
      setPaperLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Bot className="w-6 h-6 text-purple-400" />
            AI Copilot & Knowledge Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            RAG literature citations, automated Shor-vulnerability code scanner, and multi-model routing.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'chat'
                ? 'bg-purple-900/60 text-purple-300 font-bold border border-purple-700/80 shadow-glow-violet'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Research Chat (RAG)
          </button>
          <button
            onClick={() => setActiveTab('reviewer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'reviewer'
                ? 'bg-purple-900/60 text-purple-300 font-bold border border-purple-700/80 shadow-glow-violet'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Security Code Reviewer
          </button>
          <button
            onClick={() => setActiveTab('summarizer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'summarizer'
                ? 'bg-purple-900/60 text-purple-300 font-bold border border-purple-700/80 shadow-glow-violet'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Paper Summarizer
          </button>
        </div>
      </div>

      {/* VIEW 1: CHAT WITH RAG */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Box */}
          <div className="lg:col-span-3 bg-[#0D121B] border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-xl overflow-hidden">
            {/* Model Router Bar */}
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-300 font-medium">Model Router:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs rounded px-2 py-0.5 text-purple-300 font-mono focus:outline-none"
                >
                  <option value="gpt-4o">OpenAI GPT-4o (128k)</option>
                  <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (200k)</option>
                  <option value="gemini-1-5-pro">Google Gemini 1.5 Pro (1M)</option>
                  <option value="ollama-local">Local Ollama (MicroVM Air-Gapped)</option>
                </select>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                Guardrail: STRICT
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs space-y-2 leading-relaxed ${
                      msg.sender === 'USER'
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {/* Citations Box */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1 font-mono">
                          <FileText className="w-3 h-3" /> Literature Citations:
                        </span>
                        {msg.citations.map((c: any, cIdx: number) => (
                          <div key={cIdx} className="p-2 rounded bg-slate-950/70 border border-slate-800/80 text-[11px]">
                            <div className="flex items-center justify-between text-cyan-400 font-semibold">
                              <span>{c.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Match: {(c.relevanceScore * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] mt-0.5">{c.snippet}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-purple-300 flex items-center space-x-2">
                    <Bot className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Synthesizing literature across quantum and security indices...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/80 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about Bell states, NIST FIPS 203 ML-KEM, Shor's attack, or QML..."
                className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-violet disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>

          {/* Quick Research Prompts */}
          <div className="space-y-4">
            <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Suggested Inquiries</span>
              <div className="space-y-2">
                {[
                  'Explain NIST FIPS 203 ML-KEM lattice parameters',
                  'How does Shor factorize RSA-2048 with phase estimation?',
                  'Compare Grover search speedup against AES-256',
                  'What is a quantum kernel ZZFeatureMap in PyTorch?',
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => setInputMessage(promptText)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SECURITY CODE REVIEWER */}
      {activeTab === 'reviewer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Input */}
          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Source Code for Static AST Analysis
              </span>
              <button
                onClick={handleRunCodeReview}
                disabled={reviewLoading}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-glow-green transition disabled:opacity-50"
              >
                {reviewLoading ? 'Analyzing...' : 'Run Security Review'}
              </button>
            </div>
            <textarea
              rows={16}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Review Results */}
          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Vulnerability & Post-Quantum Assessment
            </span>

            {codeReviewResult ? (
              <div className="space-y-4">
                {/* Score Banner */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Security Rating</div>
                    <div className="text-2xl font-mono font-extrabold text-cyan-400">{codeReviewResult.score} / 100</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                        codeReviewResult.isSafe
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {codeReviewResult.isSafe ? 'PASS' : 'VULNERABILITIES DETECTED'}
                    </span>
                  </div>
                </div>

                {/* Shor Vulnerability Callout */}
                {codeReviewResult.pqcReadiness.usesClassicalCrypto && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-1.5">
                    <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      CRQC / Shor's Algorithm Threat Detected
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Identified quantum-vulnerable primitives: {codeReviewResult.pqcReadiness.quantumVulnerablePrimitives.join(', ')}.
                    </p>
                    <div className="text-[11px] font-mono text-cyan-400 pt-1">
                      Recommended Replacement: {codeReviewResult.pqcReadiness.suggestedPostQuantumAlternatives.join(', ')}
                    </div>
                  </div>
                )}

                {/* Finding List */}
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                  {codeReviewResult.vulnerabilities.map((v: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">
                          Line {v.line}: {v.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800">
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{v.description}</p>
                      <p className="text-[11px] text-emerald-400 font-mono">Fix: {v.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
                Click "Run Security Review" to analyze the code for OWASP flaws and Shor algorithm vulnerability.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: PAPER SUMMARIZER */}
      {activeTab === 'summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> arXiv Research Ingestion
            </span>
            <div>
              <label className="text-xs text-slate-400">Paper Title</label>
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-200 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Abstract</label>
              <textarea
                rows={6}
                value={paperAbstract}
                onChange={(e) => setPaperAbstract(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-200 mt-1 font-sans"
              />
            </div>
            <button
              onClick={handleSummarizePaper}
              disabled={paperLoading}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-glow-blue transition disabled:opacity-50"
            >
              {paperLoading ? 'Extracting Insights...' : 'Summarize Paper & Extract Equations'}
            </button>
          </div>

          <div className="bg-[#0D121B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Structured Paper Insights
            </span>
            {paperResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-300 mb-1">Executive Summary</div>
                  <p className="text-slate-300">{paperResult.summary}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-300 font-mono">Key Theoretical Hypotheses:</div>
                  {paperResult.keyInsights.map((insight: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2 text-slate-400">
                      <span className="text-cyan-400">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-purple-400 font-mono">Extracted Mathematical Formulations:</div>
                  {paperResult.mathematicalFormulas.map((f: string, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-cyan-300">
                      ${f}$
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
                Paste an arXiv paper and click summarize to extract formulas and key insights.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
