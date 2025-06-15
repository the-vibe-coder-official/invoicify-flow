
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { useInvoices, InvoiceData } from '@/hooks/useInvoices';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'cancelled': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'Paid';
    case 'sent': return 'Sent';
    case 'overdue': return 'Overdue';
    case 'draft': return 'Draft';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

export const InvoiceOverview = () => {
  const { invoices, loading } = useInvoices();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Invoice Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Invoice Overview</CardTitle>
          <CardDescription className="text-gray-300">Here you can see your latest invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No invoices created yet</p>
            <Button 
              onClick={() => navigate('/invoice/create')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
            >
              Create first invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Invoice Overview</CardTitle>
            <CardDescription className="text-gray-300">Your latest invoices</CardDescription>
          </div>
          <Button 
            onClick={() => navigate('/invoice/create')} 
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
          >
            <FileText className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.slice(0, 10).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-700/50 rounded-lg bg-gray-800/30">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-white">{invoice.invoice_number}</span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusText(invoice.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">{invoice.customer_name}</p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(invoice.date).toLocaleDateString('en-US')} | 
                  Due: {new Date(invoice.due_date).toLocaleDateString('en-US')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-white">${Number(invoice.total).toFixed(2)}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
