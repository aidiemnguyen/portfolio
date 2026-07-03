import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pdfPath = path.join(
  root,
  "public/cv/CV_Thi_Ai_Diem_Nguyen_Senior_Frontend.pdf",
);
const outPath = path.join(root, "data/cv-knowledge.txt");

if (!fs.existsSync(pdfPath)) {
  console.error("Missing PDF:", pdfPath);
  process.exit(1);
}

const buffer = fs.readFileSync(pdfPath);
const parser = new PDFParse(new Uint8Array(buffer));
const result = await parser.getText();
const raw = typeof result === "string" ? result : (result.text ?? "");
const text = raw.replace(/\n-- \d+ of \d+ --\n/g, "\n").trim();

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${text}\n`);
console.log(`Wrote ${text.length} chars → data/cv-knowledge.txt`);
