import express from "express";
import { getHybridChain } from "../llm/hybridChain.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sessionId = req.query.sessionId || "default";
  const chain = await getHybridChain(sessionId);

  const buffer = await chain.memory.bufferMemory.loadMemoryVariables();
  const entity = await chain.memory.entityMemory.loadMemoryVariables();

  res.json({ buffer, entity });
});

export default router;
