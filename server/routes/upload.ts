import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";

const router = express.Router();
const upload = multer({ dest: "server/uploads/" });

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    const dataBuffer = await fs.readFile(filePath);
    const { default: pdfParse } = await import("pdf-parse");
    const parsed = await pdfParse(dataBuffer);
    await fs.unlink(filePath); // cleanup

    res.json({ text: parsed.text });
  } catch (err) {
    console.error("PDF parse error:", err);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

export default router;
