import { runChat } from "../llm/langchain.js";

const sessionId = "debug-test-session";

async function test() {
  await runChat("My name is Darshan.", sessionId, "hybrid");
  const reply = await runChat("What’s my name?", sessionId, "hybrid");
  console.log("Reply:", reply);
}

test();
