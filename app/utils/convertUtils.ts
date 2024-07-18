function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(',');
  const contentType = header.match(/^data:(.*?);base64$/)?.[1] || 'application/octet-stream';
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function base64ToImage(base64: string): Blob {
  return base64ToBlob(base64);
}