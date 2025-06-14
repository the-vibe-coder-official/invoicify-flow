
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useInvoices } from '@/hooks/useInvoices';
import { useMemo } from 'react';

export const TopCustomers = () => {
  const { invoices, loading } = useInvoices();

  const topCustomers = useMemo(() => {
    if (!invoices.length) return [];

    const customerData = new Map();
    
    invoices.forEach(invoice => {
      const customerName = invoice.customer_name;
      
      if (!customerData.has(customerName)) {
        customerData.set(customerName, {
          name: customerName,
          email: invoice.customer_email,
          totalRevenue: 0,
          invoiceCount: 0,
          paidInvoices: 0,
          lastInvoiceDate: invoice.created_at
        });
      }
      
      const data = customerData.get(customerName);
      data.totalRevenue += Number(invoice.total);
      data.invoiceCount += 1;
      if (invoice.status === 'paid') {
        data.paidInvoices += 1;
      }
      
      // Update last invoice date if this one is more recent
      if (new Date(invoice.created_at) > new Date(data.lastInvoiceDate)) {
        data.lastInvoiceDate = invoice.created_at;
      }
    });

    return Array.from(customerData.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
  }, [invoices]);

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Your most valuable customers by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>Your most valuable customers by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        {topCustomers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No customer data available</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Invoices</TableHead>
                <TableHead className="text-center">Payment Rate</TableHead>
                <TableHead>Last Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => {
                const paymentRate = (customer.paidInvoices / customer.invoiceCount) * 100;
                return (
                  <TableRow key={customer.name}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {customer.email || 'No email'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      €{customer.totalRevenue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.invoiceCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={paymentRate >= 80 ? "default" : paymentRate >= 50 ? "secondary" : "destructive"}
                      >
                        {paymentRate.toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(customer.lastInvoiceDate).toLocaleDateString('en-US')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
