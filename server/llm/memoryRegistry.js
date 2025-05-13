import {
  ConversationBufferMemory,
  ConversationSummaryMemory,
} from "langchain/memory";
import { ChatOpenAI } from "@langchain/openai";

const memoryStore = new Map();

export function getMemory(sessionId, strategy = "buffer") {
  if (!memoryStore.has(sessionId)) {
    let memory;

    switch (strategy) {
      case "buffer":
        memory = new ConversationBufferMemory();
        break;

      case "summary":
        const llm = new ChatOpenAI({
          temperature: 0.7,
          modelName: "gpt-3.5-turbo",
          apiKey: process.env.OPENAI_API_KEY,
        });

        memory = new ConversationSummaryMemory({
          llm,
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
