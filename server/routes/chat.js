import express from "express";

import { runChat } from "../llm/langchain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const response = await runChat(message);
    res.json({ response });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
