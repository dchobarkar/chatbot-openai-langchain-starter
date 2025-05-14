import { BaseMemory } from "langchain/memory";

export async function memoryLogger(
  inputs: Record<string, any>,
  outputs: Record<string, any>,
  memory: BaseMemory
): Promise<void> {
  try {
    const state = await memory.loadMemoryVariables();
    console.log("\n\n[🧠 DEBUG] Current Memory State:");
    console.dir(state, { depth: null });

    console.log("\n📝 Input:", inputs.input);
    console.log("💬 Output:", outputs.response || outputs.text || outputs);
  } catch (err) {
    console.error("[⚠️ memoryLogger] Failed to load memory state:", err);
  }
}
