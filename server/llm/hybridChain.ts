import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import {
  ConversationBufferMemory,
  ConversationEntityMemory,
} from "langchain/memory";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

import { supabase } from "../libs/supabaseClient.js";

const chainStore = new Map();

export async function getHybridChain(sessionId = "default") {
  if (chainStore.has(sessionId)) return chainStore.get(sessionId);

  const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const bufferMemory = new ConversationBufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
  });

  const entityMemory = new ConversationEntityMemory({
    llm: model,
    memoryKey: "entities",
    returnMessages: true,
  });

  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const vectorResults = await vectorStore.similaritySearch(
    "what do you remember about me?",
    3
  );
  const longTermContext = vectorResults.map((v) => v.pageContent).join("\n");

  const customPrompt = `
Long-term memory:
${longTermContext}

Chat history:
{chat_history}

Known entities:
{entities}

User: {input}
AI:
`;

  const chain = new ConversationChain({
    llm: model,
    prompt: customPrompt,
    memory: {
      async loadMemoryVariables() {
        const history = await bufferMemory.loadMemoryVariables();
        const entities = await entityMemory.loadMemoryVariables();
        return {
          ...history,
          ...entities,
        };
      },
      async saveContext(inputs, outputs) {
        await bufferMemory.saveContext(inputs, outputs);
        await entityMemory.saveContext(inputs, outputs);
      },
      async clear() {
        await bufferMemory.clear();
        await entityMemory.clear();
      },
    },
  });

  chainStore.set(sessionId, chain);
  return chain;
}
