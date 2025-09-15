'use client';

import React, { useMemo, useState } from 'react';
import { FilesProvider, useFiles } from '@/hooks/use-files';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle, FileWarning, ShieldCheck } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { AnalysisData } from '@/lib/placeholder-data';


function DashboardPageContent() {
  const { files, analyses } = useFiles();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const selectedAnalysis = useMemo(() => {
    if (!selectedFileId) return null;
    return analyses.find(a => a.docId === selectedFileId);
  }, [selectedFileId, analyses]);

  const analysesToDisplay: AnalysisData[] = useMemo(() => {
    if (selectedAnalysis) return [selectedAnalysis];
    return analyses;
  }, [selectedAnalysis, analyses]);

  const chartData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    analysesToDisplay.forEach(analysis => {
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
  }, [analysesToDisplay]);

  const highRiskCount = useMemo(() => {
    return analysesToDisplay.reduce((acc, curr) => {
        return acc + curr.analysis.risks.filter(r => r.level === 'High').length
    }, 0);
  }, [analysesToDisplay]);

  const mediumRiskCount = useMemo(() => {
    return analysesToDisplay.reduce((acc, curr) => {
        return acc + curr.analysis.risks.filter(r => r.level === 'Medium').length
    }, 0);
  }, [analysesToDisplay]);

  const totalClauses = useMemo(() => {
     return analysesToDisplay.reduce((acc, curr) => {
        return acc + curr.analysis.clauses.length;
    }, 0);
  }, [analysesToDisplay]);
  
  const selectedFile = selectedFileId ? files.find(f => f.id === selectedFileId) : null;
  const descriptionText = selectedFile 
    ? `Showing insights for ${selectedFile.name}`
    : `AI-powered insights across all ${analyses.length} documents.`;


  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Document Dashboard</h1>
            <p className="text-muted-foreground">{descriptionText}</p>
        </div>

        <div className="max-w-sm">
            <Label htmlFor="document-select">Select a Document to View</Label>
            <Select onValueChange={(value) => setSelectedFileId(value === 'all' ? null : value)} value={selectedFileId ?? 'all'}>
                <SelectTrigger id="document-select">
                    <SelectValue placeholder="Choose a document..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                    {files.length > 0 ? files.map(file => (
                        <SelectItem key={file.id} value={file.id}>{file.name}</SelectItem>
                    )) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">No files uploaded.</div>
                    )}
                </SelectContent>
            </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clauses Analyzed</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalClauses}</div>
                     <p className="text-xs text-muted-foreground">
                        {selectedFileId ? `in this document` : `across ${analyses.length} documents`}
                    </p>
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

        <div className="grid grid-cols-1 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>
                         {selectedFileId ? `Clause risk levels for this document.` : `Clause risk levels across all documents.`}
                    </CardDescription>
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
