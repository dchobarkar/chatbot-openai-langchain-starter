import express, { Request, Response } from "express";

import { getHybridChain } from "../llm/hybridChain.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const sessionId = typeof req.query.sessionId === "string" ? req.query.sessionId : "default";
  const { bufferMemory, entityMemory } = await getHybridChain(sessionId);

  try {
    const buffer = await bufferMemory.loadMemoryVariables();
    const entity = await entityMemory.loadMemoryVariables();

    res.json({ buffer, entity });
  } catch (err) {
    console.error("Memory debug error:", err);
    res.status(500).json({ error: "Failed to load memory state" });
  }
});

export default router;
