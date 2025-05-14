import { ChatOpenAI } from "@langchain/openai";
import { ConversationBufferMemory } from "langchain/memory/buffer";
import { ConversationSummaryMemory } from "langchain/memory/summary";
import { ConversationEntityMemory } from "langchain/memory/entity";

const memoryStore = new Map<string, any>();

export function getMemory(sessionId: string, strategy: string = "buffer") {
  if (!memoryStore.has(sessionId)) {
    let memory;

    switch (strategy) {
      case "buffer":
        memory = new ConversationBufferMemory({
          memoryKey: "chat_history",
          returnMessages: true,
        });
        break;

      case "summary":
        memory = new ConversationSummaryMemory({
          llm: new ChatOpenAI({
            temperature: 0.7,
            modelName: "gpt-3.5-turbo",
            apiKey: process.env.OPENAI_API_KEY,
          }),
          memoryKey: "chat_history",
          returnMessages: true,
        });
        break;

      case "entity":
        memory = new ConversationEntityMemory({
          llm: new ChatOpenAI({
            temperature: 0.7,
            modelName: "gpt-3.5-turbo",
            apiKey: process.env.OPENAI_API_KEY,
          }),
          memoryKey: "chat_history",
          returnMessages: true,
        });
        break;

      default:
        throw new Error(`Unknown memory strategy: ${strategy}`);
    }

    memoryStore.set(sessionId, memory);
  }

  return memoryStore.get(sessionId);
}
