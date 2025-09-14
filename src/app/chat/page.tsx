import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card">
        <MessageSquare className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-headline font-semibold">
          Interactive Chat Coming Soon
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          This feature will allow you to have a conversation with your documents.
        </p>
      </div>
    </DashboardLayout>
  );
}
