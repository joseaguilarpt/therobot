import { PDFDocument, PageSizes } from "pdf-lib";
// @ts-expect-error sisis
import pkg from "imagetracerjs";
const trace = pkg;

// Types & Interfaces

interface ConvertedFile {
  fileName: string;
  fileSize: number;
  fileUrl: string; // Always a base64 string
}

interface TraceOptions {
  ltres: number;
  qtres: number;
  pathomit: number;
}

// Utility Functions

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

function getImageQuality(pixelCount: number): "low" | "medium" | "high" {
  if (pixelCount > 3_000_000) return "low";
  if (pixelCount > 250_000) return "medium";
  return "high";
}

function getTraceOptions(quality: "low" | "medium" | "high"): TraceOptions {
  return {
    ltres: quality === "low" ? 0.1 : quality === "medium" ? 1 : 10,
    qtres: quality === "low" ? 1 : quality === "medium" ? 5 : 10,
    pathomit: quality === "low" ? 8 : quality === "medium" ? 4 : 0,
  };
}

// Image Conversion Functions

/**
 * Converts a PNG File to SVG (base64-encoded).
 */
async function convertPngToSvgBase64(
  file: File,
  maxDimension: number = 1000
): Promise<string> {
  const img = await createImageBitmap(file);
  const quality = getImageQuality(img.width * img.height);

  // Downscale if needed
  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height / width) * maxDimension);
      width = maxDimension;
    } else {
      width = Math.round((width / height) * maxDimension);
      height = maxDimension;
    }
  }

  // Draw image to canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(img, 0, 0, width, height);

  // Trace to SVG
  const imageData = ctx.getImageData(0, 0, width, height);
  const traceOptions = getTraceOptions(quality);

  try {
    const svgString = trace.imagedataToSVG(imageData, traceOptions);
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  } catch (error) {
    throw error;
  }
}

/**
 * Converts images to other raster formats (e.g., jpg, bmp, webp).
 */
async function convertToOtherFormat(
  files: File[],
  format: string
): Promise<ConvertedFile[]> {
  return Promise.all(
    files.map(async (file) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(file);
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let base64: string;
      if (format.toLowerCase() === "bmp") {
        base64 = canvas.toDataURL("image/bmp");
      } else {
        base64 = canvas.toDataURL(`image/${format}`);
      }

      URL.revokeObjectURL(img.src);

      return {
        fileName: file.name.replace(/\.[^/.]+$/, `.${format}`),
        fileSize: Math.round((base64.length * 3) / 4),
        fileUrl: base64,
      };
    })
  );
}

/**
 * Converts images to PDF (single or multiple PDFs).
 */
async function convertImagesToPdf(
  imageFiles: File[],
  separatePdfs: boolean = false
): Promise<ConvertedFile[]> {
  const results: ConvertedFile[] = [];

  async function convertToPng(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Could not get canvas context"));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(
              new File([blob], file.name.replace(/\.[^/.]+$/, ".png"), {
                type: "image/png",
              })
            );
          } else {
            reject(new Error("Failed to create PNG blob"));
          }
        }, "image/png");
      };
      img.onerror = () =>
        reject(new Error(`Failed to load image: ${file.name}`));
      if (file.type === "image/tiff" || file.type === "image/webp") {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () =>
          reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      } else {
        img.src = URL.createObjectURL(file);
      }
    });
  }

  async function processSingleImage(
    file: File,
    pdfDoc: PDFDocument
  ): Promise<void> {
    let imageFile = file;
    if (
      ["image/svg+xml", "image/bmp", "image/tiff", "image/webp"].includes(
        file.type
      )
    ) {
      imageFile = await convertToPng(file);
    }
    const arrayBuffer = await imageFile.arrayBuffer();
    let img;
    if (imageFile.type === "image/jpeg" || imageFile.type === "image/jpg") {
      img = await pdfDoc.embedJpg(arrayBuffer);
    } else if (imageFile.type === "image/png") {
      img = await pdfDoc.embedPng(arrayBuffer);
    } else {
      throw new Error(`Unsupported image type: ${imageFile.type}`);
    }

    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = img.scale(1);
    const aspectRatio = width / height;
    const pdfWidth = page.getWidth();
    const pdfHeight = page.getHeight();
    const pdfAspectRatio = pdfWidth / pdfHeight;

    let scaledWidth: number, scaledHeight: number;
    if (aspectRatio > pdfAspectRatio) {
      scaledWidth = pdfWidth;
      scaledHeight = pdfWidth / aspectRatio;
    } else {
      scaledHeight = pdfHeight;
      scaledWidth = pdfHeight * aspectRatio;
    }

    page.drawImage(img, {
      x: (pdfWidth - scaledWidth) / 2,
      y: (pdfHeight - scaledHeight) / 2,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  if (separatePdfs) {
    for (const file of imageFiles) {
      try {
        const pdfDoc = await PDFDocument.create();
        await processSingleImage(file, pdfDoc);
        const pdfBytes = await pdfDoc.save();
        const base64 = uint8ArrayToBase64(pdfBytes);
        results.push({
          fileName: `${file.name.split(".")[0]}.pdf`,
          fileSize: pdfBytes.length,
          fileUrl: `data:application/pdf;base64,${base64}`,
        });
      } catch (error) {
        console.error(`Error creating PDF for file ${file.name}:`, error);
      }
    }
  } else {
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of imageFiles) {
        await processSingleImage(file, pdfDoc);
      }
      const pdfBytes = await pdfDoc.save();
      const base64 = uint8ArrayToBase64(pdfBytes);
      results.push({
        fileName: "converted_images.pdf",
        fileSize: pdfBytes.length,
        fileUrl: `data:application/pdf;base64,${base64}`,
      });
    } catch (error) {
      console.error("Error creating combined PDF:", error);
    }
  }

  return results;
}

// Main Conversion Dispatcher

export async function convertImages(
  files: File[],
  format: string,
  separatePdfs?: boolean
): Promise<ConvertedFile[]> {
  if (format === "svg") {
    return Promise.all(
      files.map(async (file) => {
        const svg = await convertPngToSvgBase64(file);
        return {
          fileName: file.name.replace(/\.[^/.]+$/, ".svg"),
          fileSize: Math.round((svg.length * 3) / 4),
          fileUrl: svg,
        };
      })
    );
  }
  if (format === "pdf") {
    return convertImagesToPdf(files, separatePdfs);
  }
  return convertToOtherFormat(files, format);
}

// Handler for UI/Forms

export async function handleFileConversion(
  files: File[],
  format: string,
  formData: FormData
): Promise<{ convertedFiles: ConvertedFile[] | null; error: string | null }> {
  if (files.length === 0 || !format) {
    return { error: "Files and format are required", convertedFiles: null };
  }
  try {
    const pdfType = formData.get("pdfType") as string;
    const separatePdfs = format === "pdf" && pdfType === "separated";
    const convertedFiles = await convertImages(files, format, separatePdfs);
    return { convertedFiles, error: null };
  } catch (e) {
    console.error("Conversion error:", e);
    return { error: "An unexpected error occurred", convertedFiles: null };
  }
}
