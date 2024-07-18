// app/utils/imageConverter.server.ts
import sharp from "sharp";
import { Readable } from "stream";
import potrace from "potrace";
import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { jsPDF } from "jspdf";
import * as pdfjsLib from 'pdfjs-dist';
import path from 'path';

// Set up the worker source
const pdfjsWorker = path.join(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.worker.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function convertPngToSvgBase64(
  pngBuffer: Buffer
): Promise<string> {
  // Convert PNG to black and white bitmap
  const bitmapBuffer = await sharp(pngBuffer)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .threshold()
    .toBuffer();

  // Trace bitmap to SVG
  const svg = await new Promise<string>((resolve, reject) => {
    potrace.trace(bitmapBuffer, (err: Error | null, svg: string) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });

  // Convert SVG to base64
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

export const createUploadHandler = () =>
  unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 10_000_000,
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );

export const parseFormData = async (request: Request) => {
  const uploadHandler = createUploadHandler();
  return await unstable_parseMultipartFormData(request, uploadHandler);
};

export const convertToSvg = async (files: File[], format: string) => {
  return await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const convertedFileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
      const svg = await convertPngToSvgBase64(buffer);
      return {
        fileName: convertedFileName,
        fileSize: buffer.length,
        fileUrl: svg,
      };
    })
  );
};

export const convertToOtherFormat = async (files: File[], format: string) => {
  return await Promise.all(
    files.map(async (file) => {
      const buffer = await sharp(await file.arrayBuffer())
        [format]()
        .toBuffer();

      const convertedFileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
      return {
        fileName: convertedFileName,
        fileSize: buffer.length,
        fileUrl: `data:image/${format};base64,${buffer.toString("base64")}`,
      };
    })
  );
};

interface PdfInfo {
  fileName: string;
  fileSize: number;
  fileUrl: string;
}

// Helper function to convert File to Buffer
async function fileToBuffer(file: any): Promise<Buffer> {
  const readable = Readable.from(file.stream());
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export const convertImagesToPdf = async (
  imageFiles: any[],
  separatePdfs: boolean = false
): Promise<PdfInfo[]> => {
  const results: PdfInfo[] = [];

  const processSingleImage = async (
    file: any,
    pdfDoc: jsPDF
  ): Promise<void> => {
    const buffer = await fileToBuffer(file);
    const image = sharp(buffer);
    const { width, height, format } = await image.metadata();

    if (!width || !height) {
      throw new Error("Unable to get image dimensions");
    }

    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const pageHeight = pdfDoc.internal.pageSize.getHeight();

    const scaleFactor = Math.min(pageWidth / width, pageHeight / height);
    const finalWidth = Math.floor(width * scaleFactor);
    const finalHeight = Math.floor(height * scaleFactor);

    let resizedImageBuffer: Buffer;

    if (format === "jpeg" || format === "jpg") {
      resizedImageBuffer = await image
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer();
    } else {
      resizedImageBuffer = await image
        .png({ quality: 100, compressionLevel: 6 })
        .toBuffer();
    }

    const imageData = `data:image/${format};base64,${resizedImageBuffer.toString(
      "base64"
    )}`;

    pdfDoc.addImage(
      imageData,
      format.toUpperCase(),
      (pageWidth - finalWidth) / 2,
      (pageHeight - finalHeight) / 2,
      finalWidth,
      finalHeight
    );
  };

  const processImages = async () => {
    if (separatePdfs) {
      for (const file of imageFiles) {
        const pdf = new jsPDF();
        await processSingleImage(file, pdf);
        const pdfBuffer = pdf.output("arraybuffer");

        results.push({
          fileName: `${file.name.split(".")[0]}.pdf`,
          fileSize: pdfBuffer.byteLength,
          fileUrl: `data:application/pdf;base64,${Buffer.from(
            pdfBuffer
          ).toString("base64")}`,
        });
      }
    } else {
      const pdf = new jsPDF();
      for (let i = 0; i < imageFiles.length; i++) {
        if (i > 0) pdf.addPage();
        await processSingleImage(imageFiles[i], pdf);
      }
      const pdfBuffer = pdf.output("arraybuffer");

      results.push({
        fileName: "converted_images.pdf",
        fileSize: pdfBuffer.byteLength,
        fileUrl: `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString(
          "base64"
        )}`,
      });
    }
  };

  await processImages();
  return results;
};
