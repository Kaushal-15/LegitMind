import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { FilesTable } from '@/components/dashboard/files-table';
import { FilesProvider } from '@/hooks/use-files';

export default function FilesPage() {
  return (
    <DashboardLayout>
      <FilesProvider>
        <div className="space-y-4">
          <FilesTable />
        </div>
      </FilesProvider>
    </DashboardLayout>
  );
}
