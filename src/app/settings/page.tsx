
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Application Settings
            </CardTitle>
            <CardDescription>This is a placeholder page for application settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Options for notifications, theme, and other application-wide settings would be available here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
