type ImageFormat = {
    value: string;
    label: string;
  };
  
  const formats: ImageFormat[] = [
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

  const popularFormats: ImageFormat[] = [
    { value: "jpeg", label: "JPEG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" },
    { value: "svg", label: "SVG" },
    { value: "pdf", label: "PDF" },
  ];
  
  interface ConversionService {
    title: string;
    icon: string;
    content: string;
    imageUrl: string;
    href: string;
    from: string;
    to: string;
    ariaLabel: string;
  }
  
  export function generateConversionServices(values: any): ConversionService[] {
    const services: ConversionService[] = [];
  
    for (const sourceFormat of values) {
      for (const targetFormat of values) {
        if (sourceFormat.value !== targetFormat.value) {
          services.push({
            title: `${sourceFormat.label} to ${targetFormat.label}`,
            icon: 'FaFileImage',
            content: `Convert ${sourceFormat.label} images to ${targetFormat.label} format.`,
            imageUrl: "#",
            from: sourceFormat.label,
            to: targetFormat.label,
            href: `/convert/${sourceFormat.value}/${targetFormat.value}`,
            ariaLabel:  `Go to ${sourceFormat.label} images to ${targetFormat.label} format converter.`
          });
        }
      }
    }
  
    return services;
  }
  
export const CONVERSIONS = generateConversionServices(formats);
export const POPULAR_CONVERSIONS = generateConversionServices(popularFormats);
