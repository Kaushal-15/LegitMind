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
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { addFile, addAnalysis } = useFiles();
  const router = useRouter();

  const handleFileChange = (fileList: FileList | null) => {
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setProgress(0);
    }
  };
  
  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setIsAnalyzing(true);
    setProgress(0);
    
    let completedCount = 0;
    
    const totalFiles = files.length;
    const progressIncrement = 100 / totalFiles;

    for (const file of files) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        
        fileReader.onload = async (e) => {
            const fileContent = e.target?.result as string;
            const fileId = new Date().toISOString() + `-${file.name}`;
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

            try {
                const result = await analyzeDocument({ documentText: fileContent });
                addAnalysis({
                    id: `analysis-${fileId}`,
                    docId: fileId,
                    docName: fileName,
                    analysis: result,
                    date: new Date().toLocaleString(),
                });
                toast({
                    title: `Analysis Complete: ${fileName}`,
                    description: `Analysis for ${fileName} is ready.`,
                });
            } catch (error) {
                console.error(`Error analyzing document ${fileName}:`, error);
                toast({
                    variant: 'destructive',
                    title: `Analysis Failed: ${fileName}`,
                    description: 'Could not analyze the document automatically.',
                });
            } finally {
                completedCount++;
                setProgress(prev => prev + progressIncrement);
                 if (completedCount === totalFiles) {
                    setIsUploading(false);
                    setIsAnalyzing(false);
                    setFiles([]); // Clear files after successful upload & analysis
                    toast({
                        title: 'All Tasks Complete',
                        description: `Finished processing all ${totalFiles} documents.`,
                    });
                    router.push(`/files`);
                }
            }
        };

        fileReader.onerror = () => {
            completedCount++;
            setProgress(prev => prev + progressIncrement);
            toast({
                variant: "destructive",
                title: "File Read Error",
                description: `Could not read the file content for ${file.name}.`,
            });
            if (completedCount === totalFiles) {
                setIsUploading(false);
                setIsAnalyzing(false);
                setFiles([]);
            }
        }
    }

  }, [files, toast, addFile, addAnalysis, router]);


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

  const clearFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const currentActionText = isUploading ? `Analyzing ${files.length} documents...` : 'Upload & Analyze';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5"/>
            Upload Documents
        </CardTitle>
        <CardDescription>Upload one or more files for AI analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300
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
            multiple
          />
          {files.length === 0 ? (
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
                <div className="w-full space-y-2 max-h-40 overflow-y-auto pr-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 bg-background p-2 rounded-lg w-full shadow-sm border">
                            <FileIcon className="h-6 w-6 text-primary" />
                            <div className="text-left flex-1 overflow-hidden">
                            <p className="font-medium truncate text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                            </div>
                            {!(isUploading || isAnalyzing) && (
                                <Button variant="ghost" size="icon" onClick={() => clearFile(index)} className="shrink-0 h-7 w-7">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

              {(isUploading || isAnalyzing) && (
                <div className="w-full max-w-md">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
                        {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                        {currentActionText}
                    </p>
                </div>
              )}

              {!(isUploading || isAnalyzing) && (
                <div className="flex flex-col items-center gap-2">
                    <Button asChild variant="link" className="text-sm -mb-2">
                         <label htmlFor="file-upload">+ Add more files</label>
                    </Button>
                    <Button onClick={handleUpload} className="mt-4">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        {currentActionText}
                    </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
