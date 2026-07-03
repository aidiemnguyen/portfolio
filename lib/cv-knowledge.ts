import fs from "fs";
import path from "path";

const KNOWLEDGE_FILE = path.join(process.cwd(), "data/cv-knowledge.txt");

let cachedKnowledge: string | null = null;

function normalizeCvText(raw: string): string {
  return raw.replace(/\n-- \d+ of \d+ --\n/g, "\n").replace(/\r/g, "").trim();
}

/** CV text extracted from public/cv/*.pdf — run \`npm run extract-cv\` after updating the PDF. */
export async function loadCvKnowledge(): Promise<string> {
  if (cachedKnowledge !== null) return cachedKnowledge;

  try {
    if (fs.existsSync(KNOWLEDGE_FILE)) {
      cachedKnowledge = normalizeCvText(
        fs.readFileSync(KNOWLEDGE_FILE, "utf8"),
      );
      return cachedKnowledge;
    }
  } catch {
    cachedKnowledge = "";
  }

  cachedKnowledge = "";
  return cachedKnowledge;
}

export function clearCvKnowledgeCache(): void {
  cachedKnowledge = null;
}
