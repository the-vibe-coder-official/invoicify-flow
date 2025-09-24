import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Invoice, InvoiceItem, InvoiceTemplate } from '@/types/invoice';
import { TemplateSelector } from './TemplateSelector';
import { LogoUpload } from './LogoUpload';
import { BankAccountSelector } from './BankAccountSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sanitizeString } from '@/lib/validation';
import { ZodError } from 'zod';

interface InvoiceFormProps {
  invoice: Invoice;
  onInvoiceChange: (invoice: Invoice) => void;
  validationErrors?: Record<string, string>;
}

export const InvoiceForm = ({ invoice, onInvoiceChange, validationErrors }: InvoiceFormProps) => {
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  const validateInput = useCallback((field: string, value: any): string | null => {
    try {
      switch (field) {
        case 'invoiceNumber':
          if (!value || value.trim().length === 0) return 'Invoice number is required';
          if (value.length > 50) return 'Invoice number must be less than 50 characters';
          if (!/^[A-Za-z0-9\-_]+$/.test(value)) return 'Invoice number can only contain letters, numbers, hyphens, and underscores';
          break;
        case 'customerName':
          if (!value || value.trim().length === 0) return 'Customer name is required';
          if (value.length > 200) return 'Customer name must be less than 200 characters';
          break;
        case 'customerEmail':
          if (value && value.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Invalid email address';
            if (value.length > 255) return 'Email must be less than 255 characters';
          }
          break;
        case 'description':
          if (!value || value.trim().length === 0) return 'Description is required';
          if (value.length > 500) return 'Description must be less than 500 characters';
          break;
        case 'quantity':
          if (value <= 0) return 'Quantity must be greater than 0';
          if (value > 9999999) return 'Quantity is too large';
          break;
        case 'price':
          if (value < 0) return 'Price cannot be negative';
          if (value > 999999999) return 'Price is too large';
          break;
      }
      return null;
    } catch {
      return 'Invalid input';
    }
  }, []);

  const handleInputChange = useCallback((field: string, value: any, index?: number) => {
    // Validate input
    const error = validateInput(field, value);
    const errorKey = index !== undefined ? `${field}_${index}` : field;
    
    setInputErrors(prev => ({
      ...prev,
      [errorKey]: error || ''
    }));

    // Sanitize string inputs
    if (typeof value === 'string') {
      value = sanitizeString(value);
    }

    return error;
  }, [validateInput]);
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

  const handleLogoUpload = (logoUrl: string) => {
    updateInvoice({ customerLogoUrl: logoUrl });
  };

  const handleLogoRemove = () => {
    updateInvoice({ customerLogoUrl: undefined });
  };

  const handleBankAccountSelect = (bankAccountId: string | undefined) => {
    updateInvoice({ bankAccountId });
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
      {/* Display validation errors */}
      {(validationErrors || Object.keys(inputErrors).some(key => inputErrors[key])) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 ml-4 list-disc">
              {Object.entries(validationErrors || {}).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
              {Object.entries(inputErrors).filter(([, error]) => error).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

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
                onChange={(e) => {
                  const error = handleInputChange('invoiceNumber', e.target.value);
                  if (!error) updateInvoice({ invoiceNumber: e.target.value });
                }}
                placeholder="INV-001"
                className={inputErrors.invoiceNumber ? 'border-destructive' : ''}
              />
              {inputErrors.invoiceNumber && (
                <p className="text-sm text-destructive mt-1">{inputErrors.invoiceNumber}</p>
              )}
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

      <BankAccountSelector
        selectedBankAccountId={invoice.bankAccountId}
        onBankAccountSelect={handleBankAccountSelect}
      />

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogoUpload
            currentLogoUrl={invoice.customerLogoUrl}
            onLogoUpload={handleLogoUpload}
            onLogoRemove={handleLogoRemove}
          />
          
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={invoice.customerName}
              onChange={(e) => {
                const error = handleInputChange('customerName', e.target.value);
                if (!error) updateInvoice({ customerName: e.target.value });
              }}
              placeholder="John Doe"
              className={inputErrors.customerName ? 'border-destructive' : ''}
            />
            {inputErrors.customerName && (
              <p className="text-sm text-destructive mt-1">{inputErrors.customerName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={invoice.customerEmail}
              onChange={(e) => {
                const error = handleInputChange('customerEmail', e.target.value);
                if (!error) updateInvoice({ customerEmail: e.target.value });
              }}
              placeholder="john@example.com"
              className={inputErrors.customerEmail ? 'border-destructive' : ''}
            />
            {inputErrors.customerEmail && (
              <p className="text-sm text-destructive mt-1">{inputErrors.customerEmail}</p>
            )}
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
                    onChange={(e) => {
                      const error = handleInputChange('description', e.target.value, index);
                      if (!error) updateItem(index, { description: e.target.value });
                    }}
                    placeholder="Service description"
                    className={inputErrors[`description_${index}`] ? 'border-destructive' : ''}
                  />
                  {inputErrors[`description_${index}`] && (
                    <p className="text-xs text-destructive mt-1">{inputErrors[`description_${index}`]}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const error = handleInputChange('quantity', value, index);
                      if (!error) updateItem(index, { quantity: value });
                    }}
                    min="0"
                    step="0.01"
                    className={inputErrors[`quantity_${index}`] ? 'border-destructive' : ''}
                  />
                  {inputErrors[`quantity_${index}`] && (
                    <p className="text-xs text-destructive mt-1">{inputErrors[`quantity_${index}`]}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const error = handleInputChange('price', value, index);
                      if (!error) updateItem(index, { price: value });
                    }}
                    min="0"
                    step="0.01"
                    className={inputErrors[`price_${index}`] ? 'border-destructive' : ''}
                  />
                  {inputErrors[`price_${index}`] && (
                    <p className="text-xs text-destructive mt-1">{inputErrors[`price_${index}`]}</p>
                  )}
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
