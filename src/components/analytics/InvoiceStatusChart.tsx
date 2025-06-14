
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useInvoices } from '@/hooks/useInvoices';
import { useMemo } from 'react';

const COLORS = {
  paid: '#10B981',
  sent: '#3B82F6',
  draft: '#6B7280',
  overdue: '#EF4444',
  cancelled: '#F59E0B'
};

const chartConfig = {
  paid: {
    label: "Paid",
    color: COLORS.paid,
  },
  sent: {
    label: "Sent",
    color: COLORS.sent,
  },
  draft: {
    label: "Draft",
    color: COLORS.draft,
  },
  overdue: {
    label: "Overdue",
    color: COLORS.overdue,
  },
  cancelled: {
    label: "Cancelled",
    color: COLORS.cancelled,
  },
};

export const InvoiceStatusChart = () => {
  const { invoices, loading } = useInvoices();

  const chartData = useMemo(() => {
    if (!invoices.length) return [];

    const statusCounts = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: COLORS[status as keyof typeof COLORS] || '#6B7280'
    }));
  }, [invoices]);

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Invoice Status Distribution</CardTitle>
          <CardDescription>Breakdown of invoice statuses</CardDescription>
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
        <CardTitle>Invoice Status Distribution</CardTitle>
        <CardDescription>Breakdown of invoice statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.map((item) => (
            <div key={item.status} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm capitalize">{item.status}: {item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
