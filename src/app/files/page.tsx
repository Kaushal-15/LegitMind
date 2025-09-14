import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { FilesTable } from '@/components/dashboard/files-table';

export default function FilesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <FilesTable />
      </div>
    </DashboardLayout>
  );
}
