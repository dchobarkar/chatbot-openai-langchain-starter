import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

import { supabase } from "../libs/supabaseClient.js";

export async function initVectorStore() {
  return await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "documents",
    queryName: "match_documents",
  });
}
