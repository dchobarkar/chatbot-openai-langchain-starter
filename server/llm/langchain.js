import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";

const memoryStore = new Map();

function getChain(sessionId) {
  if (!memoryStore.has(sessionId)) {
    const prompt = PromptTemplate.fromTemplate(`
You are a helpful website assistant. Always answer clearly.

Conversation so far:
{history}

User: {input}
Assistant:
    `);

    const memory = new BufferMemory();
    const llm = new ChatOpenAI({
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chain = new LLMChain({ prompt, llm, memory });
    memoryStore.set(sessionId, chain);
  }
  return memoryStore.get(sessionId);
}

export async function runChat(input, sessionId = "default") {
  const chain = getChain(sessionId);
  const result = await chain.call({ input });
  return result.text;
}
