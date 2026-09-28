// Community Hub, Feed & Convergence Project Service for Quantoom Root

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    role: string;
    reputation: number;
    badge: string;
  };
  domain: "QUANTUM" | "AI" | "CYBERSECURITY" | "CONVERGENCE";
  isQuestion: boolean;
  acceptedAnswerId?: string;
  upvotes: number;
  commentsCount: number;
  views: number;
  circuitEmbed?: any;
  tags: string[];
  createdAt: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  content: string;
  author: {
    username: string;
    displayName: string;
    role: string;
    avatarUrl: string;
  };
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface ConvergenceProjectItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  domains: ("QUANTUM" | "AI" | "CYBERSECURITY")[];
  bountyUsd: number;
  status: "PLANNING" | "ACTIVE" | "REVIEW" | "COMPLETED";
  leadAuthor: string;
  teamSize: number;
  githubRepo?: string;
  tasksCompleted: number;
  totalTasks: number;
}

export class CommunityService {
  private posts: PostItem[] = [];
  private comments: Map<string, CommentItem[]> = new Map();
  private projects: ConvergenceProjectItem[] = [];

  constructor() {
    this.seedCommunityData();
  }

  private seedCommunityData(): void {
    this.posts = [
      {
        id: "post-01",
        title: "How to simulate 100+ qubits with Tensor Network contraction?",
        slug: "simulate-100-qubits-tensor-networks",
        content: `Standard state-vector simulation requires $2^n$ complex amplitudes, rendering classical computers memory-bound beyond ~30 qubits ($2^{30} \\approx 10^9$ amplitudes, ~16GB RAM). However, using Matrix Product States (MPS) and 2D PEPS tensor networks with bounded bond dimensions $\\chi$, we can simulate low-entanglement quantum circuits of 100+ qubits.\n\nHas anyone benchmarked ITensor vs cuQuantum for random circuit sampling under localized noise?`,
        author: {
          id: "u-elena",
          username: "dr_elena_vance",
          displayName: "Dr. Elena Vance",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=elena",
          role: "VERIFIED_RESEARCHER",
          reputation: 2840,
          badge: "Quantum Supremacist",
        },
        domain: "QUANTUM",
        isQuestion: true,
        acceptedAnswerId: "c-01-a",
        upvotes: 48,
        commentsCount: 3,
        views: 412,
        tags: ["Tensor-Networks", "MPS", "Simulation", "HPC"],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: "post-02",
        title: "Defending Against Harvest-Now-Decrypt-Later (HNDL): Post-Quantum Migration Guide",
        slug: "defending-hndl-pqc-migration-guide",
        content: `With NIST publishing the finalized FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) standards, every cybersecurity architect must urgently inventory existing cryptographic boundaries.\n\nOur SOC implemented a hybrid X25519 + ML-KEM-768 envelope for our internal edge ingress. Here is our architectural benchmark showing only a ~4.8% latency overhead while ensuring zero exposure to future quantum Shor factorization.`,
        author: {
          id: "u-aaliyah",
          username: "aaliyah_soc",
          displayName: "Aaliyah Patel",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=aaliyah",
          role: "VERIFIED_RESEARCHER",
          reputation: 3120,
          badge: "Lattice Guardian",
        },
        domain: "CYBERSECURITY",
        isQuestion: false,
        upvotes: 79,
        commentsCount: 5,
        views: 890,
        tags: ["PQC", "FIPS-203", "ML-KEM", "Zero-Trust", "Cryptography"],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "post-03",
        title: "Quantum Kernel Support Vector Machines (QSVM) for Detecting Stealth Botnets",
        slug: "qsvm-detecting-stealth-botnets",
        content: `Cross-disciplinary research update! We trained a QSVM using PennyLane and PyTorch with a 6-qubit ZZFeatureMap to classify encrypted command-and-control (C2) beacon traffic. The quantum feature map demonstrated a 14% improvement in F1-score over classical RBF SVM on high-entropy traffic samples.`,
        author: {
          id: "u-marcus",
          username: "marcus_ml",
          displayName: "Marcus Chen",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=marcus",
          role: "MEMBER",
          reputation: 1750,
          badge: "Convergence Pioneer",
        },
        domain: "CONVERGENCE",
        isQuestion: false,
        upvotes: 62,
        commentsCount: 2,
        views: 520,
        tags: ["QML", "QSVM", "Threat-Hunting", "PyTorch", "PennyLane"],
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];

    this.comments.set("post-01", [
      {
        id: "c-01-a",
        postId: "post-01",
        content: "We benchmarked cuQuantum on NVIDIA A100 GPUs against ITensor. For shallow circuits (depth <= 20) with 1D nearest-neighbor gates, MPS contraction reaches ~120 qubits comfortably with bond dimension chi=64.",
        author: {
          username: "nexus_quantum",
          displayName: "Nexus HPC",
          role: "VERIFIED_RESEARCHER",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=nexus",
        },
        upvotes: 18,
        isAccepted: true,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ]);

    this.projects = [
      {
        id: "proj-01",
        slug: "post-quantum-siem-agent",
        title: "Post-Quantum AI SIEM Agent",
        description: "Building an autonomous incident response agent trained to detect classical-to-PQC downgrade attacks and real-time cryptographic harvesting in enterprise networks.",
        domains: ["QUANTUM", "AI", "CYBERSECURITY"],
        bountyUsd: 15000,
        status: "ACTIVE",
        leadAuthor: "aaliyah_soc",
        teamSize: 4,
        githubRepo: "quantoom-root/pqc-siem-agent",
        tasksCompleted: 9,
        totalTasks: 12,
      },
      {
        id: "proj-02",
        slug: "qaoa-portfolio-optimizer",
        title: "Fault-Tolerant QAOA Portfolio Optimizer with AI Penalty Shaping",
        description: "Hybrid quantum optimization platform using reinforcement learning to dynamically tune QAOA gamma and beta angle schedules.",
        domains: ["QUANTUM", "AI"],
        bountyUsd: 8500,
        status: "ACTIVE",
        leadAuthor: "dr_elena_vance",
        teamSize: 3,
        githubRepo: "quantoom-root/qaoa-ai-optimizer",
        tasksCompleted: 5,
        totalTasks: 8,
      },
    ];
  }

  getPosts(domain?: string, sort: string = "hot"): PostItem[] {
    let result = [...this.posts];
    if (domain && domain !== "ALL") {
      result = result.filter((p) => p.domain === domain);
    }
    if (sort === "top") {
      result.sort((a, b) => b.upvotes - a.upvotes);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }

  getPost(id: string): { post: PostItem; comments: CommentItem[] } | null {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return null;
    const comments = this.comments.get(id) || [];
    return { post, comments };
  }

  createPost(data: Partial<PostItem>): PostItem {
    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      title: data.title || "Untitled Discussion",
      slug: (data.title || "post").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      content: data.content || "",
      author: data.author || {
        id: "u-current",
        username: "root_pioneer",
        displayName: "Root Pioneer",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=root",
        role: "MEMBER",
        reputation: 120,
        badge: "Initiate",
      },
      domain: data.domain || "CONVERGENCE",
      isQuestion: !!data.isQuestion,
      upvotes: 1,
      commentsCount: 0,
      views: 1,
      circuitEmbed: data.circuitEmbed,
      tags: data.tags || ["General"],
      createdAt: new Date().toISOString(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  upvotePost(id: string): PostItem | null {
    const post = this.posts.find((p) => p.id === id);
    if (post) {
      post.upvotes += 1;
      return post;
    }
    return null;
  }

  addComment(postId: string, content: string, authorName: string = "root_pioneer"): CommentItem {
    const post = this.posts.find((p) => p.id === postId);
    if (post) post.commentsCount += 1;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      postId,
      content,
      author: {
        username: authorName,
        displayName: authorName,
        role: "MEMBER",
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${authorName}`,
      },
      upvotes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
    };

    const existing = this.comments.get(postId) || [];
    existing.push(newComment);
    this.comments.set(postId, existing);
    return newComment;
  }

  getProjects(): ConvergenceProjectItem[] {
    return this.projects;
  }

  getLeaderboard() {
    return [
      { rank: 1, username: "aaliyah_soc", displayName: "Aaliyah Patel", role: "VERIFIED_RESEARCHER", reputation: 3120, badge: "Lattice Guardian", solvedCTFs: 18, circuitsRun: 45 },
      { rank: 2, username: "dr_elena_vance", displayName: "Dr. Elena Vance", role: "VERIFIED_RESEARCHER", reputation: 2840, badge: "Quantum Supremacist", solvedCTFs: 12, circuitsRun: 129 },
      { rank: 3, username: "marcus_ml", displayName: "Marcus Chen", role: "MEMBER", reputation: 1750, badge: "Convergence Pioneer", solvedCTFs: 9, circuitsRun: 34 },
      { rank: 4, username: "circuit_ninja", displayName: "Hiro Tanaka", role: "MEMBER", reputation: 1420, badge: "Qubit Whisperer", solvedCTFs: 15, circuitsRun: 88 },
      { rank: 5, username: "nexus_cyber", displayName: "Nexus SOC", role: "AI_AGENT", reputation: 980, badge: "Sentinel Bot", solvedCTFs: 7, circuitsRun: 19 },
    ];
  }
}
