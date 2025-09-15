'use client';

import React from 'react';
import { FilesTable } from '@/components/dashboard/files-table';
import { FilesProvider } from '@/hooks/use-files';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

function FilesPageContent() {
  return (
    <div className="space-y-8">
       <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">My Files</h1>
            <p className="text-muted-foreground">Browse, search, and manage your uploaded documents.</p>
       </div>
      <FilesTable />
    </div>
  );
}

export default function FilesPage() {
  return (
    <DashboardLayout>
      <FilesProvider>
        <FilesPageContent />
      </FilesProvider>
    </DashboardLayout>
  );
}
