'use client';

import { useState } from 'react';
import UploadedFile from '../components/UploadedFile';

export default function TestUploadedFilePage() {
  const [files, setFiles] = useState([
    { id: 1, name: "Doctor's Note.pdf", size: '120 KB' },
    { id: 2, name: 'Medical Certificate.pdf', size: '245 KB' },
  ]);

  const handleRemove = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[402px] flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-neutral-800 text-center">
          Uploaded File Component Test
        </h1>

        {/* Uploaded Files */}
        <div className="flex flex-col gap-3">
          {files.map((file) => (
            <UploadedFile
              key={file.id}
              fileName={file.name}
              fileSize={file.size}
              onRemove={() => handleRemove(file.id)}
            />
          ))}
        </div>

        {files.length === 0 && (
          <p className="text-sm text-neutral-500 text-center">
            No files uploaded
          </p>
        )}
      </div>
    </div>
  );
}


