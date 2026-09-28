// AI Copilot & Knowledge Engine API Routes
import { Router } from "express";
import { RAGKnowledgeEngine } from "../ai/ragEngine";

const router = Router();
const ragEngine = new RAGKnowledgeEngine();

// AI Copilot Chat with RAG
router.post("/chat", async (req, res) => {
  try {
    const { message, model = "gpt-4o" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message parameter is required." });
    }

    const aiResult = await RAGKnowledgeEngine.generateChatResponse(message, model, ragEngine);
    return res.json(aiResult);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "AI copilot failed to process request." });
  }
});

// Static Security Code Reviewer
router.post("/review-code", (req, res) => {
  try {
    const { code, language = "python" } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code parameter is required." });
    }

    const review = RAGKnowledgeEngine.reviewCode(code, language);
    return res.json(review);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Research Paper Summarizer
router.post("/summarize-paper", (req, res) => {
  try {
    const { title, abstract = "", text = "" } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Paper title is required." });
    }

    const summary = RAGKnowledgeEngine.summarizePaper(title, abstract, text);
    return res.json(summary);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Available Model Router Endpoints
router.get("/models", (req, res) => {
  return res.json({
    models: [
      { id: "gpt-4o", name: "OpenAI GPT-4o", provider: "OpenAI", status: "ONLINE", contextWindow: "128k" },
      { id: "claude-3-5-sonnet", name: "Anthropic Claude 3.5 Sonnet", provider: "Anthropic", status: "ONLINE", contextWindow: "200k" },
      { id: "gemini-1-5-pro", name: "Google Gemini 1.5 Pro", provider: "Google DeepMind", status: "ONLINE", contextWindow: "1M" },
      { id: "ollama-local", name: "Local Ollama (Qwen2.5-Coder / Llama 3.2)", provider: "Local MicroVM", status: "ONLINE", contextWindow: "32k" },
    ],
  });
});

export default router;
