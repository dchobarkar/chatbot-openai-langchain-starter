import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import chatRoute from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("Chatbot backend is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
