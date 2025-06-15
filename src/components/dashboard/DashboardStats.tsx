
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';

export const DashboardStats = () => {
  const { stats, loading } = useInvoices();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            Total Invoices
          </CardTitle>
          <FileText className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalInvoices}</div>
          <p className="text-xs text-gray-400">
            All created invoices
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            Pending Invoices
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.pendingInvoices}</div>
          <p className="text-xs text-gray-400">
            Awaiting payment
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            Total Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">€{stats.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            From all invoices
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            Overdue Invoices
          </CardTitle>
          <Users className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">{stats.overdueInvoices}</div>
          <p className="text-xs text-gray-400">
            Need attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
