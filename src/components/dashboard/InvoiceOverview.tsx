
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { useInvoices, InvoiceData } from '@/hooks/useInvoices';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'sent': return 'bg-blue-100 text-blue-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'Bezahlt';
    case 'sent': return 'Versendet';
    case 'overdue': return 'Überfällig';
    case 'draft': return 'Entwurf';
    case 'cancelled': return 'Storniert';
    default: return status;
  }
};

export const InvoiceOverview = () => {
  const { invoices, loading } = useInvoices();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rechnungsübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rechnungsübersicht</CardTitle>
          <CardDescription>Hier sehen Sie Ihre neuesten Rechnungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Noch keine Rechnungen erstellt</p>
            <Button onClick={() => navigate('/invoice/create')}>
              Erste Rechnung erstellen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rechnungsübersicht</CardTitle>
            <CardDescription>Ihre neuesten Rechnungen</CardDescription>
          </div>
          <Button onClick={() => navigate('/invoice/create')} size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Neue Rechnung
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.slice(0, 10).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{invoice.invoice_number}</span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusText(invoice.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{invoice.customer_name}</p>
                <p className="text-xs text-gray-500">
                  Erstellt: {new Date(invoice.date).toLocaleDateString('de-DE')} | 
                  Fällig: {new Date(invoice.due_date).toLocaleDateString('de-DE')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">€{Number(invoice.total).toFixed(2)}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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
