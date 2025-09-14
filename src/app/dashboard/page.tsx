'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp, AlertOctagon, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { analyzeDocument, AnalyzeDocumentOutput } from '@/ai/flows/analyze-document';
import { useFiles, FilesProvider } from '@/hooks/use-files';
import { useToast } from '@/hooks/use-toast';

const barChartConfig = {
  count: {
    label: 'Count',
  },
} satisfies ChartConfig;

const pieChartConfig = {
  risks: {
    label: 'Risks',
  },
  low: {
    label: 'Low',
    color: 'hsl(var(--chart-2))',
  },
  medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-1))',
  },
  high: {
    label: 'High',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-1))', 'hsl(var(--chart-5))'];

type ClauseCount = { clause: string; count: number };

function DashboardPageContent() {
  const { files, getFileContent } = useFiles();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [totalDocs, setTotalDocs] = useState(0);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [riskData, setRiskData] = useState<{ risk: string; count: number; }[]>([]);
  const [clauseData, setClauseData] = useState<ClauseCount[]>([]);

  useEffect(() => {
    const processFiles = async () => {
      setIsLoading(true);
      setTotalDocs(files.length);

      if (files.length === 0) {
        setHighRiskCount(0);
        setRiskData([]);
        setClauseData([]);
        setIsLoading(false);
        return;
      }

      const allAnalyses: AnalyzeDocumentOutput[] = [];
      for (const file of files) {
        const documentText = getFileContent(file.id);
        if (documentText) {
          try {
            const result = await analyzeDocument({ documentText });
            allAnalyses.push(result);
          } catch (error) {
            console.error(`Could not analyze ${file.name}:`, error);
            toast({
              variant: 'destructive',
              title: `Analysis Failed for ${file.name}`,
              description: 'There was an error analyzing one of your documents.',
            });
          }
        }
      }

      // Aggregate data from all analyses
      let highRisk = 0;
      const riskCounts = { Low: 0, Medium: 0, High: 0 };
      const clauseCounts: { [key: string]: number } = {};

      allAnalyses.forEach(analysis => {
        analysis.risks.forEach(risk => {
          riskCounts[risk.level]++;
          if (risk.level === 'High') {
            highRisk++;
          }
        });
        analysis.clauses.forEach(clause => {
            if(riskCounts.High > 0 || riskCounts.Medium > 0){
                clauseCounts[clause.title] = (clauseCounts[clause.title] || 0) + 1;
            }
        });
      });

      setHighRiskCount(highRisk);
      setRiskData([
        { risk: 'low', count: riskCounts.Low },
        { risk: 'medium', count: riskCounts.Medium },
        { risk: 'high', count: riskCounts.High },
      ]);
      
      const sortedClauses = Object.entries(clauseCounts)
        .map(([clause, count]) => ({ clause, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setClauseData(sortedClauses);
      setIsLoading(false);
    };

    processFiles();
  }, [files, getFileContent, toast]);

  if (isLoading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="ml-4 text-xl">Analyzing documents...</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-xl">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Total Documents
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold">{totalDocs}</p>
                  <p className="text-xs text-muted-foreground">Number of uploaded files</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-xl">
                      <AlertOctagon className="h-5 w-5 text-primary" />
                      High-Risk Issues
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold">{highRiskCount}</p>
                  <p className="text-xs text-muted-foreground">Total high-risk items found</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-xl">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Obligations Met
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold">N/A</p>
                  <p className="text-xs text-muted-foreground">Tracking not implemented</p>
              </CardContent>
          </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                  <BarChart className="h-5 w-5"/>
                  Most Common Risky Clauses
              </CardTitle>
              <CardDescription>
                  Frequency of high and medium risk clauses across all documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clauseData.length > 0 ? (
                <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                    <RechartsBarChart data={clauseData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" dataKey="count" hide />
                    <YAxis
                        dataKey="clause"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        width={120}
                        className="text-xs"
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--secondary))' }}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  <p>No risky clause data to display.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                  <PieChart className="h-5 w-5"/>
                  Risk Level Distribution
              </CardTitle>
              <CardDescription>
                  Overall breakdown of identified risk levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
               {riskData.some(d => d.count > 0) ? (
                 <ChartContainer
                    config={pieChartConfig}
                    className="mx-auto aspect-square h-[250px]"
                    >
                    <RechartsPieChart>
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--secondary))' }}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Pie
                        data={riskData}
                        dataKey="count"
                        nameKey="risk"
                        innerRadius={60}
                        strokeWidth={5}
                        >
                        {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                    </RechartsPieChart>
                </ChartContainer>
               ) : (
                <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                  <p>No risk data to display.</p>
                </div>
              )}
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
    )
}
