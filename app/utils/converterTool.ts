import { PDFDocument, PageSizes } from "pdf-lib";
// @ts-expect-error sisis
import pkg from "imagetracerjs";
const trace = pkg;

interface ConvertedFile {
  fileName: string;
  fileSize: number;
  fileUrl: string; // This will always be a base64 string
}

interface TraceOptions {
  ltres: number;
  qtres: number;
  pathomit: number;
}

async function convertPngToSvgBase64(
  file: File,
  maxDimension: number = 1000
): Promise<string> {
  // Create an image bitmap from the file
  const img = await createImageBitmap(file);

  // Determine quality based on original image size
  let quality: "low" | "medium" | "high";
  const pixelCount = img.width * img.height;
  if (pixelCount > 3000000) {
    // More than 3 megapixel
    quality = "low";
  } else if (pixelCount > 250000) {
    // More than 0.25 megapixels
    quality = "medium";
  } else {
    quality = "high";
  }

  // Downscale the image if it's too large
  let width = img.width;
  let height = img.height;
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height / width) * maxDimension);
      width = maxDimension;
    } else {
      width = Math.round((width / height) * maxDimension);
      height = maxDimension;
    }
  }

  // Create a canvas and draw the image
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(img, 0, 0, width, height);

  // Get the image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Define trace options based on quality
  const traceOptions: TraceOptions = {
    ltres: quality === "low" ? 0.1 : quality === "medium" ? 1 : 10,
    qtres: quality === "low" ? 1 : quality === "medium" ? 5 : 10,
    pathomit: quality === "low" ? 8 : quality === "medium" ? 4 : 0,
  };

  // Perform the tracing
  return new Promise((resolve, reject) => {
    try {
      const svgString = trace.imagedataToSVG(imageData, traceOptions);
      resolve(`data:image/svg+xml;base64,${btoa(svgString)}`);
    } catch (error) {
      reject(error);
    }
  });
}

async function convertToOtherFormat(
  files: File[],
  format: string
): Promise<ConvertedFile[]> {
  return await Promise.all(
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
        // BMP conversion logic here if needed
        base64 = canvas.toDataURL("image/bmp");
      } else {
        base64 = canvas.toDataURL(`image/${format}`);
      }

      URL.revokeObjectURL(img.src);

      return {
        fileName: file.name.replace(/\.[^/.]+$/, `.${format}`),
        fileSize: Math.round((base64.length * 3) / 4), // Approximate size
        fileUrl: base64,
      };
    })
  );
}

async function convertImagesToPdf(imageFiles: File[], separatePdfs: boolean = false): Promise<ConvertedFile[]> {
  const results: ConvertedFile[] = [];

  async function convertToPng(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' });
            resolve(pngFile);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png');
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));

      // For TIFF and WebP files, we need to use a FileReader to get a data URL
      if (file.type === 'image/tiff' || file.type === 'image/webp') {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      } else {
        img.src = URL.createObjectURL(file);
      }
    });
  }

  async function processSingleImage(file: File, pdfDoc: PDFDocument): Promise<void> {
    let imageFile = file;
    if (['image/svg+xml', 'image/bmp', 'image/tiff', 'image/webp'].includes(file.type)) {
      imageFile = await convertToPng(file);
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    let img;
    if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
      img = await pdfDoc.embedJpg(arrayBuffer);
    } else if (imageFile.type === 'image/png') {
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

  function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  if (separatePdfs) {
    for (const file of imageFiles) {
      try {
        const pdfDoc = await PDFDocument.create();
        await processSingleImage(file, pdfDoc);
        const pdfBytes = await pdfDoc.save();
        const base64 = uint8ArrayToBase64(pdfBytes);

        results.push({
          fileName: `${file.name.split('.')[0]}.pdf`,
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
        fileName: 'converted_images.pdf',
        fileSize: pdfBytes.length,
        fileUrl: `data:application/pdf;base64,${base64}`,
      });
    } catch (error) {
      console.error('Error creating combined PDF:', error);
    }
  }

  return results;
}

export async function convertImages(
  files: File[],
  format: string,
  separatePdfs?: boolean
): Promise<ConvertedFile[]> {
  if (format === "svg") {
    return await Promise.all(
      files.map(async (file) => {
        const svg = await convertPngToSvgBase64(file);
        return {
          fileName: file.name.replace(/\.[^/.]+$/, ".svg"),
          fileSize: Math.round((svg.length * 3) / 4), // Approximate size
          fileUrl: svg,
        };
      })
    );
  } else if (format === "pdf") {
    return await convertImagesToPdf(files, separatePdfs);
  } else {
    return await convertToOtherFormat(files, format);
  }
}

export async function handleFileConversion(
  files: File[],
  format: string,
  formData: FormData
): Promise<{ convertedFiles: ConvertedFile[] | null; error: string | null }> {
  if (files.length === 0 || !format) {
    return {
      error: "Files and format are required",
      convertedFiles: null,
    };
  }

  try {
    const pdfType = formData.get("pdfType") as string;
    const separatePdfs = format === "pdf" && pdfType === "separated";
    const convertedFiles = await convertImages(files, format, separatePdfs);

    return { convertedFiles, error: null };
  } catch (e) {
    console.error("Conversion error:", e);
    return {
      error: "An unexpected error occurred",
      convertedFiles: null,
    };
  }
}
