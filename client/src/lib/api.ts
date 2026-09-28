// API Client Interface for Quantoom Root

const API_BASE = '/api/v1';

export async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// Quantum API
export const apiSimulateCircuit = (numQubits: number, gates: any[], shots: number = 1024) =>
  fetchJson('/quantum/simulate', {
    method: 'POST',
    body: JSON.stringify({ numQubits, gates, shots }),
  });

export const apiGetAlgorithms = () => fetchJson('/quantum/algorithms');

export const apiTranspileCircuit = (numQubits: number, gates: any[], targetFormat: string = 'openqasm') =>
  fetchJson('/quantum/transpile', {
    method: 'POST',
    body: JSON.stringify({ numQubits, gates, targetFormat }),
  });

export const apiGetProviders = () => fetchJson('/quantum/providers');

// AI Copilot API
export const apiSendAIChat = (message: string, model: string = 'gpt-4o') =>
  fetchJson('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, model }),
  });

export const apiReviewCode = (code: string, language: string = 'python') =>
  fetchJson('/ai/review-code', {
    method: 'POST',
    body: JSON.stringify({ code, language }),
  });

export const apiSummarizePaper = (title: string, abstract: string, text: string) =>
  fetchJson('/ai/summarize-paper', {
    method: 'POST',
    body: JSON.stringify({ title, abstract, text }),
  });

// Cyber Range API
export const apiGetCTFChallenges = () => fetchJson('/cyber/challenges');

export const apiSubmitFlag = (challengeId: string, flag: string) =>
  fetchJson(`/cyber/challenges/${challengeId}/submit-flag`, {
    method: 'POST',
    body: JSON.stringify({ flag }),
  });

export const apiGetSIEMEvents = (limit: number = 8) => fetchJson(`/cyber/siem/events?limit=${limit}`);

export const apiGetThreatIntel = () => fetchJson('/cyber/threat-intel');

// Community API
export const apiGetFeed = (domain?: string, sort: string = 'hot') =>
  fetchJson(`/community/feed?${domain ? `domain=${domain}&` : ''}sort=${sort}`);

export const apiCreatePost = (data: { title: string; content: string; domain: string; isQuestion?: boolean; tags?: string[] }) =>
  fetchJson('/community/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiUpvotePost = (postId: string) =>
  fetchJson(`/community/posts/${postId}/upvote`, {
    method: 'POST',
  });

export const apiAddComment = (postId: string, content: string) =>
  fetchJson(`/community/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

export const apiGetProjects = () => fetchJson('/community/projects');

export const apiGetLeaderboard = () => fetchJson('/community/leaderboard');

// PQC Handshake
export const apiPQCHandshake = () =>
  fetchJson('/auth/pqc/handshake', {
    method: 'POST',
    body: JSON.stringify({ clientKyberPublicKey: 'MOCK_KYBER_PUBKEY_768_BITS' }),
  });

export const apiGetStats = () => fetchJson('/stats');
