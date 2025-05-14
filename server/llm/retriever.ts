import fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

let vectorStore;

export async function createKnowledgeBase(text) {
  fs.writeFileSync("server/uploads/docs.txt", text);

  const loader = new TextLoader("server/uploads/docs.txt");
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);
  const embeddings = new OpenAIEmbeddings();

  vectorStore = await Chroma.fromDocuments(chunks, embeddings);
}

export async function askDocQuestion(query) {
  if (!vectorStore) throw new Error("No knowledge base loaded");
  const model = new ChatOpenAI();
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const result = await chain.call({ query });
  return result.text;
}
