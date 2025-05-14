import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import chatRoute from "./routes/chat.js";
import uploadRoute from "./routes/upload.js";
import chatDocRoute from "./routes/chat-doc.js";
import debugRoute from "./routes/debug.js";

dotenv.config();
process.env.LANGCHAIN_HANDLER = "console";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup (dynamic)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

// Routes
app.use("/chat", chatRoute);
app.use("/upload", uploadRoute);
app.use("/chat-doc", chatDocRoute);
app.use("/debug", debugRoute);

// Health check
app.get("/", (req, res) => {
  res.send("Chatbot backend is running");
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
