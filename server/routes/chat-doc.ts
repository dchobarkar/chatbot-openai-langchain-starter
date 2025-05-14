import express, { Request, Response } from "express";

import { askDocQuestion } from "../llm/retriever.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || !message.trim())
    return res.status(400).json({ error: "Message is required" });

  try {
    const response = await askDocQuestion(message);
    res.json({ response });
  } catch (err) {
    console.error("RAG chat error:", err);
    res.status(500).json({ error: "RAG failed" });
  }
});

export default router;
