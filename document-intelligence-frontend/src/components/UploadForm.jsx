'use client';
import { useDropzone } from 'react-dropzone';

export default function UploadForm({ onUpload }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    onDrop: acceptedFiles => onUpload(acceptedFiles),
  });

  return (
    <div {...getRootProps()} className="border-2 border-solid border-gray-200 p-6 rounded-lg text-center cursor-pointer ">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the document here...</p>
      ) : (
        <p >Drag & drop a document here, or click to upload</p>
      )}
    </div>
  );
}
