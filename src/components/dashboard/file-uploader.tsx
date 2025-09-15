'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, File as FileIcon, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFiles } from '@/hooks/use-files';
import { FileData } from '@/lib/placeholder-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeDocument } from '@/ai/flows/analyze-document';


export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { addFile, addAnalysis } = useFiles();
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

    const uploadInterval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + 5));
    }, 200);

    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      clearInterval(uploadInterval);
      setProgress(100);

      const fileContent = e.target?.result as string;
      const fileId = new Date().toISOString();
      const fileName = file.name;

      const newFile: FileData = {
        id: fileId,
        name: fileName,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        date: new Date().toLocaleString(),
        type: (file.name.split('.').pop() as 'pdf' | 'docx' | 'txt') || 'txt',
        content: fileContent,
      };
      
      addFile(newFile);

      toast({
        title: 'Upload Complete',
        description: `${fileName} has been successfully uploaded. Starting analysis...`,
      });

      setIsUploading(false);
      setIsAnalyzing(true);

      // Automatically trigger analysis
      analyzeDocument({ documentText: fileContent })
        .then(result => {
          addAnalysis({
            id: `analysis-${fileId}`,
            docId: fileId,
            docName: fileName,
            analysis: result,
            date: new Date().toLocaleString(),
          });
          toast({
            title: 'Analysis Complete',
            description: `Analysis for ${fileName} is ready.`,
          });
          router.push(`/files`);
        })
        .catch(error => {
          console.error('Error analyzing document:', error);
          toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'Could not analyze the document automatically.',
          });
        })
        .finally(() => {
          setIsAnalyzing(false);
          setFile(null);
        });
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

  }, [file, toast, addFile, addAnalysis, router]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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

  const currentActionText = isUploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Upload';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5"/>
            Upload Document
        </CardTitle>
        <CardDescription>Upload PDF, DOCX, or TXT files for AI analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300
            ${isDragging ? 'border-primary bg-primary/10' : 'border-border/80 bg-secondary/50'}
          `}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={isUploading || isAnalyzing}
          />
          {!file ? (
            <>
              <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-base font-medium">
                Drag & drop files here, or
              </p>
              <Button asChild variant="link" className="text-base text-primary">
                <label htmlFor="file-upload">click to browse</label>
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                Supports PDF, DOCX, TXT.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 bg-background p-3 rounded-lg w-full max-w-md shadow-sm border">
                <FileIcon className="h-8 w-8 text-primary" />
                <div className="text-left flex-1 overflow-hidden">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                {!(isUploading || isAnalyzing) && (
                    <Button variant="ghost" size="icon" onClick={clearFile} className="shrink-0">
                        <X className="h-5 w-5" />
                    </Button>
                )}
              </div>

              {(isUploading || isAnalyzing) && (
                <div className="w-full max-w-md">
                    {isUploading && <Progress value={progress} className="h-2" />}
                    <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
                        {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                        {currentActionText}
                    </p>
                </div>
              )}

              {!(isUploading || isAnalyzing) && (
                <Button onClick={handleUpload} className="mt-4">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload & Analyze
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
