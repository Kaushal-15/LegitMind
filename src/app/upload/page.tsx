import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { FileUploader } from '@/components/dashboard/file-uploader';
import { GuidanceTool } from '@/components/dashboard/guidance-tool';
import { FilesProvider } from '@/hooks/use-files';

export default function UploadPage() {
  return (
    <DashboardLayout>
      <FilesProvider>
        <div className="flex-1 space-y-8">
          <div className="text-center">
              <h1 className="text-3xl font-bold font-headline tracking-tight md:text-4xl">
              Secure Document Upload
              </h1>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Upload your documents with confidence. Your files are encrypted and processed securely by our AI.
              </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <FileUploader />
            </div>
            <div className="lg:col-span-1">
              <GuidanceTool />
            </div>
          </div>
        </div>
      </FilesProvider>
    </DashboardLayout>
  );
}
