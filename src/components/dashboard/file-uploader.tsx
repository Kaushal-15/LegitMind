'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFiles } from '@/hooks/use-files';
import { FileData } from '@/lib/placeholder-data';

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { addFile } = useFiles();
  const router = useRouter();

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const selectedFile = files[0];
      // Loosening file type validation for demonstration purposes, as content is mocked.
      // In a real app with proper parsing, you'd keep this strict.
      setFile(selectedFile);
      setProgress(0);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    // Mock upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + 5));
    }, 200);

    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      clearInterval(uploadInterval);
      setProgress(100);

      const fileContent = e.target?.result as string;

      const newFile: FileData = {
        id: new Date().toISOString(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        date: new Date().toLocaleDateString('en-CA'),
        type: (file.name.split('.').pop() as 'pdf' | 'docx' | 'txt') || 'txt',
        content: fileContent,
      };
      
      addFile(newFile);

      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: 'Upload Complete',
          description: `${file.name} has been successfully uploaded.`,
        });
        
        router.push('/files');
      }, 500);
    };

    fileReader.onerror = () => {
        clearInterval(uploadInterval);
        setIsUploading(false);
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the file content.",
        });
    }

  }, [file, toast, addFile, router]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
  };

  return (
    <div 
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300
        ${isDragging ? 'border-accent bg-accent/10' : 'border-border/80 bg-card'}
      `}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf,.docx,.txt"
        onChange={(e) => handleFileChange(e.target.files)}
        disabled={isUploading}
      />
      {!file ? (
        <>
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">
            Drag & drop files here
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse. Supports PDF, DOCX, TXT.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <label htmlFor="file-upload">Browse Files</label>
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-secondary p-3 rounded-lg w-full max-w-md">
            <FileIcon className="h-8 w-8 text-primary" />
            <div className="text-left flex-1 overflow-hidden">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            {!isUploading && (
                <Button variant="ghost" size="icon" onClick={clearFile} className="shrink-0">
                    <X className="h-5 w-5" />
                </Button>
            )}
          </div>

          {isUploading && (
            <div className="w-full max-w-md">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
            </div>
          )}

          {!isUploading && (
            <Button onClick={handleUpload} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
