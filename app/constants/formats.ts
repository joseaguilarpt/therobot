export const FORMATS = [
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
  { value: "gif", label: "GIF" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
  { value: "tiff", label: "TIFF" },
  { value: "svg", label: "SVG" },
  { value: "bmp", label: "BMP" },
  { value: "pdf", label: "PDF" },
];

export const PLAIN_FORMATS = FORMATS.map((item) => item.value)

export const allOptions = FORMATS.map((item, index) => ({
  ...item,
  id: index,
}));

export function isValidFormat (format: string) {
    return PLAIN_FORMATS.indexOf(format) !== -1
}