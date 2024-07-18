// In app/routes/convert.tsx
import { useState } from 'react';
import { Form, useActionData, useSubmit } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/node';
import { json, unstable_parseMultipartFormData, unstable_createFileUploadHandler } from '@remix-run/node';
import sharp from 'sharp';
import DragAndDrop from '../DragDrop/DragDrop';

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_createFileUploadHandler({
    maxPartSize: 5 * 1024 * 1024, // 5 MB
    file: ({ filename }) => filename,
  });

  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const files = formData.getAll('file') as File[];
  const format = formData.get('format') as string | null;

  if (files.length === 0 || !format) {
    return json({ error: 'Files and format are required' }, { status: 400 });
  }

  try {
    const convertedFiles = await Promise.all(files.map(async (file) => {
      const buffer = await sharp(await file.arrayBuffer())
        [format]()
        .toBuffer();

      const convertedFileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
      
      return { 
        fileName: convertedFileName,
        fileSize: buffer.length,
        fileUrl: `data:image/${format};base64,${buffer.toString('base64')}`
      };
    }));

    return json({ convertedFiles });
  } catch (error) {
    return json({ error: 'Conversion failed' }, { status: 500 });
  }
};

export default function Convert() {
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const [error, setError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('png');

  const handleFilesDrop = (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    formData.append('format', selectedFormat);
    submit(formData, { method: 'post', encType: 'multipart/form-data' });
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div>
      <h1>Convert Images</h1>
      <Form method="post" encType="multipart/form-data">
        <div>
          <label htmlFor="format">Convert to:</label>
          <select 
            id="format" 
            name="format" 
            value={selectedFormat} 
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
            <option value="gif">GIF</option>
            <option value="tiff">TIFF</option>
            <option value="bmp">BMP</option>
          </select>
        </div>
        <DragAndDrop 
          onFilesDrop={handleFilesDrop} 
          onError={handleError}
          acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
          maxSize={5_000_000} // 5 MB
        />
      </Form>

      {error && <p className="error">{error}</p>}
      {actionData?.error && <p className="error">Error: {actionData.error}</p>}
      
      {actionData?.convertedFiles && (
        <div>
          <h2>Converted Files:</h2>
          {actionData.convertedFiles.map((file, index) => (
            <div key={index}>
              <p>Name: {file.fileName}</p>
              <p>Size: {file.fileSize} bytes</p>
              <img src={file.fileUrl} alt="Converted image" style={{maxWidth: '100%'}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}