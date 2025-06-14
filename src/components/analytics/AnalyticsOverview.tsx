
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, FileText } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import { useMemo } from 'react';

export const AnalyticsOverview = () => {
  const { invoices, loading } = useInvoices();

  const analytics = useMemo(() => {
    if (!invoices.length) {
      return {
        totalRevenue: 0,
        averageInvoiceValue: 0,
        paidInvoices: 0,
        averagePaymentTime: 0,
        monthlyGrowth: 0,
        conversionRate: 0
      };
    }

    const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const averageInvoiceValue = totalRevenue / invoices.length;
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
    const conversionRate = (paidInvoices / invoices.length) * 100;
    
    // Calculate monthly growth (simplified)
    const thisMonth = new Date().getMonth();
    const thisMonthInvoices = invoices.filter(invoice => 
      new Date(invoice.created_at).getMonth() === thisMonth
    );
    const lastMonthInvoices = invoices.filter(invoice => 
      new Date(invoice.created_at).getMonth() === thisMonth - 1
    );
    
    const thisMonthRevenue = thisMonthInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const lastMonthRevenue = lastMonthInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const monthlyGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      totalRevenue,
      averageInvoiceValue,
      paidInvoices,
      averagePaymentTime: 18, // Mock data
      monthlyGrowth,
      conversionRate
    };
  }, [invoices]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{analytics.totalRevenue.toFixed(2)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {analytics.monthlyGrowth >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={analytics.monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(analytics.monthlyGrowth).toFixed(1)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Invoice Value</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{analytics.averageInvoiceValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per invoice</p>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Invoices paid</p>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.paidInvoices}</div>
          <p className="text-xs text-muted-foreground">Successfully collected</p>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Payment Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.averagePaymentTime} days</div>
          <p className="text-xs text-muted-foreground">From invoice to payment</p>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${analytics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.monthlyGrowth >= 0 ? '+' : ''}{analytics.monthlyGrowth.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Revenue growth</p>
        </CardContent>
      </Card>
    </div>
  );
};
