import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

// 🧠 Create memory per session/user
const memoryStore = new Map();

function getChain(sessionId) {
  if (!memoryStore.has(sessionId)) {
    const memory = new BufferMemory();
    const model = new ChatOpenAI({
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });
    const chain = new ConversationChain({ llm: model, memory });
    memoryStore.set(sessionId, chain);
  }
  return memoryStore.get(sessionId);
}

export async function runChat(input, sessionId = "default") {
  const chain = getChain(sessionId);
  const result = await chain.call({ input });
  return result.response;
}
