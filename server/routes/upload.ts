import express from "express";
import multer from "multer";
import fs from "fs";
const pdf = await import("pdf-parse");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const { default: pdfParse } = await import("pdf-parse");
    const parsed = await pdfParse(dataBuffer);
    fs.unlinkSync(filePath);

    res.json({ text: parsed.text });
  } catch (err) {
    console.error("PDF parse error:", err);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

export default router;
