// Community Hub & Social API Routes
import { Router } from "express";
import { CommunityService } from "../community/communityService";
import { AuthRequest } from "../middleware/auth";

const router = Router();
const communityService = new CommunityService();

// Get Community Feed
router.get("/feed", (req, res) => {
  const domain = req.query.domain as string;
  const sort = (req.query.sort as string) || "hot";
  const posts = communityService.getPosts(domain, sort);
  return res.json({ posts });
});

// Get Single Post + Thread
router.get("/posts/:id", (req, res) => {
  const result = communityService.getPost(req.params.id);
  if (!result) {
    return res.status(404).json({ error: "Post not found." });
  }
  return res.json(result);
});

// Create Post
router.post("/posts", (req: AuthRequest, res) => {
  const { title, content, domain, isQuestion, tags, circuitEmbed } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const post = communityService.createPost({
    title,
    content,
    domain: domain || "CONVERGENCE",
    isQuestion: !!isQuestion,
    tags: tags || ["General"],
    circuitEmbed,
    author: req.user
      ? {
          id: req.user.id,
          username: req.user.username,
          displayName: req.user.username,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${req.user.username}`,
          role: req.user.role,
          reputation: 150,
          badge: "Active Contributor",
        }
      : undefined,
  });

  return res.status(201).json({ post });
});

// Upvote Post
router.post("/posts/:id/upvote", (req, res) => {
  const post = communityService.upvotePost(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }
  return res.json({ post });
});

// Add Comment
router.post("/posts/:id/comments", (req: AuthRequest, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Comment content is required." });
  }
  const authorName = req.user?.username || "root_explorer";
  const comment = communityService.addComment(req.params.id, content, authorName);
  return res.status(201).json({ comment });
});

// Convergence Projects
router.get("/projects", (req, res) => {
  const projects = communityService.getProjects();
  return res.json({ projects });
});

// Global Leaderboard
router.get("/leaderboard", (req, res) => {
  const leaderboard = communityService.getLeaderboard();
  return res.json({ leaderboard });
});

export default router;
