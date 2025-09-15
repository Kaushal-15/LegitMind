'use client';

import { useRouter } from 'next/navigation';
import { File, MoreHorizontal, PenSquare, Trash2, Eye, MessageSquare, Microscope, Loader2 } from 'lucide-react';
import { FileData } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFiles } from '@/hooks/use-files';
import { aiSummarizeDocument } from '@/ai/flows/ai-summarize-document';
import { useState } from 'react';

const fileTypeIcons = {
  pdf: <File className="text-red-500" />,
  docx: <File className="text-blue-500" />,
  txt: <File className="text-gray-500" />,
};

export function FilesTable() {
  const router = useRouter();
  const { toast } = useToast();
  const { files, deleteFile, getFileContent, addSummary } = useFiles();
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  const handleAskQuestion = (file: FileData) => {
    router.push(`/chat?fileId=${file.id}&fileName=${encodeURIComponent(file.name)}`);
  };

  const handleSummarize = async (file: FileData) => {
    setSummarizingId(file.id);
    toast({
      title: 'Summarization in Progress',
      description: `We're summarizing ${file.name}. This may take a moment.`,
    });

    const documentText = getFileContent(file.id);
    if (!documentText) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not read the file content to generate a summary.',
      });
      setSummarizingId(null);
      return;
    }

    try {
      const result = await aiSummarizeDocument({ documentText });
      addSummary({
        id: `summary-${file.id}`,
        docId: file.id,
        docName: file.name,
        summary: result.summary,
        date: new Date().toLocaleDateString('en-CA'),
      });
       toast({
        title: 'Summarization Complete',
        description: `Summary for ${file.name} is ready.`,
      });
      router.push('/summaries');
    } catch (error) {
      console.error('Error summarizing document:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'Could not summarize the document at this time.',
      });
    } finally {
      setSummarizingId(null);
    }
  };
  
  const handleAnalyze = (file: FileData) => {
    router.push(`/analysis?fileId=${file.id}&fileName=${encodeURIComponent(file.name)}`);
  };

  const handleDelete = (file: FileData) => {
    deleteFile(file.id);
    toast({
        variant: "destructive",
        title: 'File Deleted',
        description: `${file.name} has been moved to the trash.`,
    });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">My Files</CardTitle>
            <CardDescription>Your uploaded documents will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden sm:table-cell">Date Added</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {files.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                        No files uploaded yet.
                        </TableCell>
                    </TableRow>
                )}
                {files.map((file) => (
                <TableRow key={file.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                        {fileTypeIcons[file.type]}
                        <span>{file.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="uppercase">{file.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{file.size}</TableCell>
                    <TableCell className="hidden sm:table-cell">{file.date}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!!summarizingId}>
                           {summarizingId === file.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleAskQuestion(file)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Ask Question
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAnalyze(file)}>
                            <Microscope className="mr-2 h-4 w-4" />
                            Analyze
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSummarize(file)}>
                            <PenSquare className="mr-2 h-4 w-4" />
                            Summarize
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(file)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
      </CardContent>
    </Card>
  );
}
