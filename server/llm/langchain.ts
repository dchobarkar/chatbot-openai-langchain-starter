import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";

import { getHybridChain } from "./hybridChain.js";
import { getMemory } from "./memoryRegistry.js";

const chainStore = new Map();

function getChain(sessionId, memoryStrategy = "buffer") {
  if (!chainStore.has(sessionId)) {
    const prompt = PromptTemplate.fromTemplate(`
You are a helpful website assistant. Always answer clearly.

Conversation so far:
{history}

User: {input}
Assistant:
    `);

    const llm = new ChatOpenAI({
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const memory = getMemory(sessionId, memoryStrategy);
    const chain = new LLMChain({ prompt, llm, memory });

    chainStore.set(sessionId, chain);
  }

  return chainStore.get(sessionId);
}

export async function runChat(
  input,
  sessionId = "default",
  strategy = "hybrid"
) {
  let chain;

  if (strategy === "hybrid") {
    chain = await getHybridChain(sessionId);
  } else {
    chain = getChain(sessionId, strategy);
  }

  const result = await chain.call({ input });

  // Debug: Print memory state
  if (chain.memory && chain.memory.loadMemoryVariables) {
    const memoryState = await chain.memory.loadMemoryVariables();
    console.log("\n[DEBUG] Memory State:", memoryState);
    console.log("User Input:", input);
    console.log("Bot Output:", result.text);
  }

  return result.text;
}
