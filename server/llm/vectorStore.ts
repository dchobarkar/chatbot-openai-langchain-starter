import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

import { supabase } from "./supabaseClient.js";

export async function initVectorStore() {
  return await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "documents",
    queryName: "match_documents",
  });
}
