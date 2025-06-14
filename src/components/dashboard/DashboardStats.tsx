
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';

export const DashboardStats = () => {
  const { stats, loading } = useInvoices();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Invoices
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          <p className="text-xs text-muted-foreground">
            All created invoices
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Invoices
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting payment
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            From all invoices
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Overdue Invoices
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</div>
          <p className="text-xs text-muted-foreground">
            Need attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
