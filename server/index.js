import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import chatRoute from "./routes/chat.js";
import uploadRoute from "./routes/upload.js";
import chatDocRoute from "./routes/chat-doc.js";
import debugRoute from "./routes/debug.js";

process.env.LANGCHAIN_HANDLER = "console";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "https://chatbot-openai-langchain-starter.vercel.app/",
  })
);
app.use(express.json());

app.use("/chat", chatRoute);
app.use("/upload", uploadRoute);
app.use("/chat-doc", chatDocRoute);
app.use("/debug", debugRoute);

app.get("/", (req, res) => {
  res.send("Chatbot backend is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
