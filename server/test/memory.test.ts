import { runChat } from "../llm/langchain.js";

const sessionId = "debug-test-session";

async function test() {
  try {
    console.log("\n--- TEST: Set Name ---");
    await runChat("My name is Darshan.", sessionId, "hybrid");

    console.log("\n--- TEST: Recall Name ---");
    const reply = await runChat("What’s my name?", sessionId, "hybrid");

    console.log("\n✅ Reply:", reply);
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

test();
