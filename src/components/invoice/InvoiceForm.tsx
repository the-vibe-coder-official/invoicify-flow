
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem, InvoiceTemplate } from '@/types/invoice';
import { TemplateSelector } from './TemplateSelector';

interface InvoiceFormProps {
  invoice: Invoice;
  onInvoiceChange: (invoice: Invoice) => void;
}

export const InvoiceForm = ({ invoice, onInvoiceChange }: InvoiceFormProps) => {
  const updateInvoice = (updates: Partial<Invoice>) => {
    const updatedInvoice = { ...invoice, ...updates };
    
    // Recalculate totals
    const subtotal = updatedInvoice.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (updatedInvoice.taxRate / 100);
    const total = subtotal + taxAmount;
    
    onInvoiceChange({
      ...updatedInvoice,
      subtotal,
      taxAmount,
      total
    });
  };

  const handleTemplateChange = (template: InvoiceTemplate) => {
    updateInvoice({ template });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    updateInvoice({ items: [...invoice.items, newItem] });
  };

  const updateItem = (index: number, updates: Partial<InvoiceItem>) => {
    const updatedItems = [...invoice.items];
    const updatedItem = { ...updatedItems[index], ...updates };
    updatedItem.total = updatedItem.quantity * updatedItem.price;
    updatedItems[index] = updatedItem;
    updateInvoice({ items: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    updateInvoice({ items: updatedItems });
  };

  return (
    <div className="space-y-6">
      <TemplateSelector 
        selectedTemplate={invoice.template || 'modern'} 
        onTemplateChange={handleTemplateChange} 
      />

      <Card>
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
                placeholder="INV-001"
              />
            </div>
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={invoice.date}
                onChange={(e) => updateInvoice({ date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoice.dueDate}
                onChange={(e) => updateInvoice({ dueDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={invoice.customerName}
              onChange={(e) => updateInvoice({ customerName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={invoice.customerEmail}
              onChange={(e) => updateInvoice({ customerEmail: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="customerAddress">Address</Label>
            <Textarea
              id="customerAddress"
              value={invoice.customerAddress}
              onChange={(e) => updateInvoice({ customerAddress: e.target.value })}
              placeholder="123 Main Street, 12345 City"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoice.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    placeholder="Service description"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, { price: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Total ($)</Label>
                  <Input
                    value={item.total.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax & Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-32">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={invoice.taxRate}
                onChange={(e) => updateInvoice({ taxRate: Number(e.target.value) })}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={invoice.notes || ''}
            onChange={(e) => updateInvoice({ notes: e.target.value })}
            placeholder="Additional notes or payment terms..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};
