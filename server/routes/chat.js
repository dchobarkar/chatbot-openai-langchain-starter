import express from "express";
import { v4 as uuidv4 } from "uuid";

import { runChat } from "../llm/langchain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, sessionId, strategy = "buffer" } = req.body;
  const finalSessionId = sessionId || uuidv4();

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await runChat(message, finalSessionId, strategy);
    res.json({ response, sessionId: finalSessionId });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
