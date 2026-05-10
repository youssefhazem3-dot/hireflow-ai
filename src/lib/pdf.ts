export async function extractPdfText(buffer: ArrayBuffer, fileName = "uploaded CV") {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });

    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  } catch (error) {
    console.warn(
      "PDF text extraction failed; continuing with fallback CV text.",
      error,
    );

    return `Uploaded CV file: ${fileName}. PDF text extraction was unavailable, so the demo analysis used the candidate details, selected role, and file metadata.`;
  }
}

export async function extractTextFromUpload(file: File) {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return extractPdfText(await file.arrayBuffer(), file.name);
  }

  if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
    return file.text();
  }

  return `Uploaded CV file: ${file.name}. Text extraction requires PDF or TXT in the built-in parser.`;
}
