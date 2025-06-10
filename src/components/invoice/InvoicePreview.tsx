
import { Invoice } from '@/types/invoice';
import { Card } from '@/components/ui/card';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RECHNUNG</h1>
          <div className="text-sm text-gray-600">
            <p>Rechnungsnummer: <span className="font-medium">{invoice.invoiceNumber || 'Nicht angegeben'}</span></p>
            <p>Datum: <span className="font-medium">{formatDate(invoice.date)}</span></p>
            <p>Fällig: <span className="font-medium">{formatDate(invoice.dueDate)}</span></p>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Rechnungsempfänger:</h2>
          <div className="text-gray-700">
            <p className="font-medium">{invoice.customerName || 'Kundenname'}</p>
            <p className="text-sm">{invoice.customerEmail}</p>
            <div className="text-sm whitespace-pre-line mt-2">
              {invoice.customerAddress}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 font-semibold text-gray-900">Beschreibung</th>
                <th className="text-right py-2 font-semibold text-gray-900 w-20">Menge</th>
                <th className="text-right py-2 font-semibold text-gray-900 w-24">Preis</th>
                <th className="text-right py-2 font-semibold text-gray-900 w-24">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-700">{item.description || 'Keine Beschreibung'}</td>
                    <td className="py-3 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-700">€{item.price.toFixed(2)}</td>
                    <td className="py-3 text-right text-gray-700">€{item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Keine Rechnungspositionen hinzugefügt
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t pt-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Zwischensumme:</span>
                <span>€{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Steuer ({invoice.taxRate}%):</span>
                <span>€{invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Gesamtsumme:</span>
                <span>€{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Notizen:</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
