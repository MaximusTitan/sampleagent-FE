//Repo Change
'use client';

import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useFileContext } from '@/context/FileContext';

export default function FileUpload() {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const { files, setFiles } = useFileContext(); // Use context for managing files

  const router = useRouter();

  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter((file) => allowedTypes.includes(file.type));
      setFiles([...files, ...validFiles]); // Update directly
    },
    [allowedTypes, files, setFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter((file) => allowedTypes.includes(file.type));
        setFiles([...files, ...validFiles]); // Update directly
      }
    },
    [allowedTypes, files, setFiles]
  );

  const redirectToMain = () => {
    router.push('/main');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add sources</DialogTitle>
          <p className="text-muted-foreground">
            Upload your documents to get started. We support various file formats to help you manage your information
            effectively.
          </p>
        </DialogHeader>
        <div
          className={`mt-4 relative rounded-lg border-2 border-dashed p-12 ${
            isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <p className="text-lg">
                Drag & drop or{' '}
                <label className="text-blue-500 hover:underline cursor-pointer">
                  choose file
                  <input
                    type="file"
                    className="sr-only"
                    multiple
                    accept=".pdf,.txt,.docx,.csv,.xlsx"
                    onChange={handleFileChange}
                  />
                </label>{' '}
                to upload
              </p>
              <p className="text-sm text-muted-foreground">Supported file types: PDF, TXT, DOCX, CSV, XLSX</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Selected files:</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1"
            onClick={() => {
              console.log('Files to upload:', files);
              redirectToMain();
            }}
          >
            Upload files
          </Button>
          <Button variant="outline" className="flex-1" onClick={redirectToMain}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
