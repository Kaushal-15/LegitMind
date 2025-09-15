'use client';

import React from 'react';
import { FileUploader } from '@/components/dashboard/file-uploader';
import { FilesTable } from '@/components/dashboard/files-table';
import { FilesProvider } from '@/hooks/use-files';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

function DashboardPageContent() {
  return (
    <div className="space-y-8">
       <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Document Dashboard</h1>
            <p className="text-muted-foreground">Manage and analyze your legal documents with AI-powered insights</p>
       </div>
      <FileUploader />
      <FilesTable />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <FilesProvider>
        <DashboardPageContent />
      </FilesProvider>
    </DashboardLayout>
  );
}
