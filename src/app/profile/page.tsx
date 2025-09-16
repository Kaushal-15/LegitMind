
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">Manage your profile information.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Details
            </CardTitle>
            <CardDescription>This is a placeholder page for user profile settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Full profile management features would be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
