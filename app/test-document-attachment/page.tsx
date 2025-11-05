'use client';

import { useState } from 'react';
import DocumentAttachment from '../components/DocumentAttachment';

export default function TestDocumentAttachmentPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    alert(`File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[402px] flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-neutral-800 text-center">
          Document Upload Component Test
        </h1>

        {/* Basic Upload Component */}
        <DocumentAttachment onFileSelect={handleFileSelect} />

        {/* Selected File Info */}
        {selectedFile && (
          <div className="rounded-xl bg-white p-4 border border-neutral-200">
            <p className="text-sm text-neutral-500 mb-2">Selected File:</p>
            <p className="text-base font-semibold text-neutral-800">
              {selectedFile.name}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
