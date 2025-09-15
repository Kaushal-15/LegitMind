'use client';

import React, { useMemo } from 'react';
import { FileUploader } from '@/components/dashboard/file-uploader';
import { GuidanceTool } from '@/components/dashboard/guidance-tool';
import { FilesProvider, useFiles } from '@/hooks/use-files';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle, FileWarning, ShieldCheck } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { riskData } from '@/lib/placeholder-data';


function DashboardPageContent() {
  const { analyses } = useFiles();

  const chartData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    analyses.forEach(analysis => {
      analysis.analysis.risks.forEach(risk => {
        if (risk.level === 'Low') counts.low++;
        if (risk.level === 'Medium') counts.medium++;
        if (risk.level === 'High') counts.high++;
      });
    });
    return [
        { risk: 'Low', count: counts.low, fill: 'var(--chart-2)' },
        { risk: 'Medium', count: counts.medium, fill: 'var(--chart-1)' },
        { risk: 'High', count: counts.high, fill: 'var(--chart-5)' },
    ]
  }, [analyses]);

  const highRiskCount = useMemo(() => {
    return analyses.reduce((acc, curr) => {
        return acc + curr.analysis.risks.filter(r => r.level === 'High').length
    }, 0);
  }, [analyses]);

  const mediumRiskCount = useMemo(() => {
    return analyses.reduce((acc, curr) => {
        return acc + curr.analysis.risks.filter(r => r.level === 'Medium').length
    }, 0);
  }, [analyses]);

  const totalClauses = useMemo(() => {
     return analyses.reduce((acc, curr) => {
        return acc + curr.analysis.clauses.length;
    }, 0);
  }, [analyses])

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Document Dashboard</h1>
            <p className="text-muted-foreground">AI-powered insights across all your legal documents.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clauses Analyzed</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalClauses}</div>
                    <p className="text-xs text-muted-foreground">across {analyses.length} documents</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">High-Risk Clauses</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{highRiskCount}</div>
                    <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Moderate-Risk Clauses</CardTitle>
                    <FileWarning className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mediumRiskCount}</div>
                    <p className="text-xs text-muted-foreground">Should be reviewed</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Clause risk levels across all documents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="risk" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--secondary))' }}
                                contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <div className="lg:col-span-2">
                <FileUploader />
            </div>
        </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           <div className="lg:col-span-3">
                <GuidanceTool />
           </div>
        </div>

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
