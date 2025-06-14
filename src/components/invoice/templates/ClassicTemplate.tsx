
import { Invoice } from '@/types/invoice';
import { Card } from '@/components/ui/card';

interface ClassicTemplateProps {
  invoice: Invoice;
}

export const ClassicTemplate = ({ invoice }: ClassicTemplateProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <Card className="p-8 bg-white border-4 border-gray-800">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center border-double border-4 border-gray-800 p-6">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">INVOICE</h1>
          <div className="text-gray-700 font-mono">
            <p>Invoice No: {invoice.invoiceNumber || 'Not specified'}</p>
            <p>Date: {formatDate(invoice.date)} | Due: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border-2 border-gray-400 p-4">
          <h2 className="text-lg font-serif font-bold text-gray-900 mb-3 underline">BILL TO:</h2>
          <div className="text-gray-700 font-mono">
            <p className="font-bold text-lg">{invoice.customerName || 'Customer Name'}</p>
            <p>{invoice.customerEmail}</p>
            <div className="whitespace-pre-line mt-2">
              {invoice.customerAddress}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="border-2 border-gray-800">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left py-3 px-4 font-serif border-r border-white">DESCRIPTION</th>
                <th className="text-center py-3 px-4 font-serif border-r border-white w-20">QTY</th>
                <th className="text-center py-3 px-4 font-serif border-r border-white w-24">PRICE</th>
                <th className="text-center py-3 px-4 font-serif w-24">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-400">
                    <td className="py-3 px-4 text-gray-700 font-mono border-r border-gray-400">{item.description || 'No description'}</td>
                    <td className="py-3 px-4 text-center text-gray-700 font-mono border-r border-gray-400">{item.quantity}</td>
                    <td className="py-3 px-4 text-center text-gray-700 font-mono border-r border-gray-400">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center text-gray-700 font-mono">${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 font-mono">
                    No invoice items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-2 border-gray-400 bg-gray-50">
          <div className="flex justify-end p-4">
            <div className="w-64 space-y-2 font-mono">
              <div className="flex justify-between text-gray-700 border-b border-gray-400 pb-1">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 border-b border-gray-400 pb-1">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-double border-t-4 border-gray-800 pt-2">
                <span>TOTAL:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-2 border-gray-400 p-4">
            <h3 className="font-serif font-bold text-gray-900 mb-2 underline">NOTES:</h3>
            <p className="text-gray-700 font-mono text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
