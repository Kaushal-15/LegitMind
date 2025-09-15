'use client';

import { FileUploader } from '@/components/dashboard/file-uploader';
import { GuidanceTool } from '@/components/dashboard/guidance-tool';
import { FilesProvider } from '@/hooks/use-files';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

function UploadPageContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">Upload Documents</h1>
        <p className="text-muted-foreground">Upload and analyze one or more documents.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <FileUploader />
        </div>
        <div className="lg:col-span-2">
          <GuidanceTool />
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <DashboardLayout>
      <FilesProvider>
        <UploadPageContent />
      </FilesProvider>
    </DashboardLayout>
  );
}
