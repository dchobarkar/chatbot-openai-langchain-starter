import { BufferMemory } from "langchain/memory";

const memoryStore = new Map();

export function getMemory(sessionId, strategy = "buffer") {
  if (!memoryStore.has(sessionId)) {
    switch (strategy) {
      case "buffer":
        memoryStore.set(sessionId, new BufferMemory());
        break;

      // Placeholder for other types like:
      // case 'summary':
      // case 'entity':
      // Add later...

      default:
        throw new Error(`Unknown memory strategy: ${strategy}`);
    }
  }

  return memoryStore.get(sessionId);
}
