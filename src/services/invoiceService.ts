
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/types/invoice';

export const saveInvoiceToDatabase = async (invoice: Invoice, userId: string): Promise<string> => {
  try {
    // Insert invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        invoice_number: invoice.invoiceNumber,
        date: invoice.date,
        due_date: invoice.dueDate,
        customer_name: invoice.customerName,
        customer_email: invoice.customerEmail,
        customer_address: invoice.customerAddress,
        subtotal: invoice.subtotal,
        tax_rate: invoice.taxRate,
        tax_amount: invoice.taxAmount,
        total: invoice.total,
        status: 'draft',
        notes: invoice.notes
      })
      .select('id')
      .single();

    if (invoiceError) throw invoiceError;

    const invoiceId = invoiceData.id;

    // Insert invoice items
    if (invoice.items.length > 0) {
      const invoiceItems = invoice.items.map(item => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);

      if (itemsError) throw itemsError;
    }

    return invoiceId;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw new Error('Rechnung konnte nicht gespeichert werden');
  }
};
