import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

const model = new ChatOpenAI({
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory });

export async function runChat(input) {
  const result = await chain.call({ input });
  return result.response;
}
