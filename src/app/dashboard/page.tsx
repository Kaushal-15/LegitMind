'use client';

import { BarChart, PieChart, TrendingUp, AlertOctagon, CheckCircle2 } from 'lucide-react';
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
import { riskData, clauseData } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';

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

export default function DashboardPage() {
  return (
    <DashboardLayout>
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
                    <p className="text-4xl font-bold">128</p>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
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
                    <p className="text-4xl font-bold">23</p>
                    <p className="text-xs text-muted-foreground">Across 15 documents</p>
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
                    <p className="text-4xl font-bold">94%</p>
                    <p className="text-xs text-muted-foreground">All time completion rate</p>
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
              </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
