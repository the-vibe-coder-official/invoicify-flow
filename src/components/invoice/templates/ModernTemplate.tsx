
import { Invoice } from '@/types/invoice';
import { Card } from '@/components/ui/card';

interface ModernTemplateProps {
  invoice: Invoice;
}

export const ModernTemplate = ({ invoice }: ModernTemplateProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b-2 border-blue-300 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 mb-2">INVOICE</h1>
              <div className="text-blue-700 font-medium">
                <p>#{invoice.invoiceNumber || 'Not specified'}</p>
              </div>
            </div>
            <div className="text-right text-sm text-blue-800">
              <p>Date: <span className="font-medium">{formatDate(invoice.date)}</span></p>
              <p>Due: <span className="font-medium">{formatDate(invoice.dueDate)}</span></p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white/70 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Bill To:</h2>
          <div className="text-gray-700">
            <p className="font-medium text-lg">{invoice.customerName || 'Customer Name'}</p>
            <p className="text-blue-600">{invoice.customerEmail}</p>
            <div className="text-sm whitespace-pre-line mt-2">
              {invoice.customerAddress}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white/70 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
                <th className="text-right py-3 px-4 font-semibold w-20">Qty</th>
                <th className="text-right py-3 px-4 font-semibold w-24">Price</th>
                <th className="text-right py-3 px-4 font-semibold w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-blue-50/50' : 'bg-white'}>
                    <td className="py-3 px-4 text-gray-700">{item.description || 'No description'}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-700">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 bg-white">
                    No invoice items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="bg-white/70 p-4 rounded-lg">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-blue-900 border-t-2 border-blue-300 pt-2">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-white/70 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Notes:</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
