
import { Invoice } from '@/types/invoice';
import { Card } from '@/components/ui/card';

interface MinimalTemplateProps {
  invoice: Invoice;
}

export const MinimalTemplate = ({ invoice }: MinimalTemplateProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <Card className="p-8 bg-white shadow-none border-none">
      <div className="space-y-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-light text-gray-900 tracking-wide">Invoice</h1>
            <p className="text-gray-500 text-sm mt-1">{invoice.invoiceNumber || 'Not specified'}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>{formatDate(invoice.date)}</p>
            <p className="text-gray-400">Due {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
          <div className="text-gray-700">
            <p className="font-medium">{invoice.customerName || 'Customer Name'}</p>
            <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
            <div className="text-sm text-gray-500 whitespace-pre-line mt-1">
              {invoice.customerAddress}
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="space-y-4">
            {invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-gray-900">{item.description || 'No description'}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">${item.total.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-400">
                No invoice items added
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-end">
            <div className="w-48 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-900 border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Notes</p>
            <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
