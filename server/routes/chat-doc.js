import express from "express";

import { askDocQuestion } from "../llm/retriever.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  try {
    const response = await askDocQuestion(message);
    res.json({ response });
  } catch (err) {
    console.error("RAG chat error:", err);
    res.status(500).json({ error: "RAG failed" });
  }
});

export default router;
