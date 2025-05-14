import { initVectorStore } from "./vectorStore.js";

export async function storeMemory(text) {
  const store = await initVectorStore();
  await store.addDocuments([{ pageContent: text }]);
}

export async function queryMemory(queryText, k = 3) {
  const store = await initVectorStore();
  const results = await store.similaritySearch(queryText, k);
  return results.map((r) => r.pageContent).join("\n");
}
