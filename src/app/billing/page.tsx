
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Details
            </CardTitle>
            <CardDescription>This is a placeholder page for billing management.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Information about the current plan, payment history, and saved payment methods would be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
