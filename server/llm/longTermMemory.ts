import { initVectorStore } from "./vectorStore.js";

export async function storeMemory(text: string): Promise<void> {
  try {
    const store = await initVectorStore();
    await store.addDocuments([{ pageContent: text }]);
  } catch (err) {
    console.error("Failed to store memory:", err);
  }
}

export async function queryMemory(queryText: string, k = 3): Promise<string> {
  try {
    const store = await initVectorStore();
    const results = await store.similaritySearch(queryText, k);
    return results.map((r) => r.pageContent).join("\n");
  } catch (err) {
    console.error("Vector query failed:", err);
    return "";
  }
}
