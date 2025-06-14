
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useInvoices } from '@/hooks/useInvoices';
import { useMemo } from 'react';

const chartConfig = {
  invoices: {
    label: "Invoices",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
};

export const MonthlyMetrics = () => {
  const { invoices, loading } = useInvoices();

  const chartData = useMemo(() => {
    if (!invoices.length) return [];

    const monthlyData = new Map();
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          invoices: 0,
          revenue: 0
        });
      }
      
      const data = monthlyData.get(monthKey);
      data.invoices += 1;
      data.revenue += Number(invoice.total);
    });

    return Array.from(monthlyData.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [invoices]);

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>Invoice count and revenue by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
        <CardDescription>Invoice count and revenue by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€${value.toLocaleString()}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                yAxisId="left"
                dataKey="invoices" 
                fill="var(--color-invoices)" 
                name="Invoices"
              />
              <Bar 
                yAxisId="right"
                dataKey="revenue" 
                fill="var(--color-revenue)" 
                name="Revenue (€)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
