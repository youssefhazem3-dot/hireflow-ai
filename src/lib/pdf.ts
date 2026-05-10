import { PDFParse } from "pdf-parse";

export async function extractPdfText(buffer: ArrayBuffer) {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

export async function extractTextFromUpload(file: File) {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return extractPdfText(await file.arrayBuffer());
  }

  if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
    return file.text();
  }

  return `Uploaded CV file: ${file.name}. Text extraction requires PDF or TXT in the built-in parser.`;
}
