import fs from "fs/promises";
import { createRequire } from "module";

// pdf-parse can be CommonJS or ESM; support both versions 1.x and 2.x
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);

    // Support pdf-parse v2.x (class PDFParse)
    if (pdfModule.PDFParse) {
      const parser = new pdfModule.PDFParse({ data: dataBuffer });
      const textResult = await parser.getText();
      let info = {};
      try {
        info = await parser.getInfo();
      } catch (e) {}
      await parser.destroy();
      return {
        extractedText: textResult.text || "",
        numPages: textResult.total || 1,
        info: info || {},
      };
    }

    // Support pdf-parse v1.x (function)
    if (typeof pdfModule === "function") {
      const data = await pdfModule(dataBuffer);
      return {
        extractedText: data.text || "",
        numPages: data.numpages || 1,
        info: data.info || {},
      };
    }

    if (typeof pdfModule.default === "function") {
      const data = await pdfModule.default(dataBuffer);
      return {
        extractedText: data.text || "",
        numPages: data.numpages || 1,
        info: data.info || {},
      };
    }

    throw new Error("Unsupported pdf-parse module format");
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};