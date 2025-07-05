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
        customer_logo_url: invoice.customerLogoUrl,
        subtotal: invoice.subtotal,
        tax_rate: invoice.taxRate,
        tax_amount: invoice.taxAmount,
        total: invoice.total,
        status: 'draft',
        notes: invoice.notes,
        bank_account_id: invoice.bankAccountId
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
    throw new Error('Could not save invoice to database');
  }
};

export const getInvoiceById = async (invoiceId: string): Promise<Invoice> => {
  try {
    // Get invoice data
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError) throw invoiceError;

    // Get invoice items
    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: true });

    if (itemsError) throw itemsError;

    // Transform data to Invoice format
    const invoice: Invoice = {
      id: invoiceData.id,
      invoiceNumber: invoiceData.invoice_number,
      date: invoiceData.date,
      dueDate: invoiceData.due_date,
      customerName: invoiceData.customer_name,
      customerEmail: invoiceData.customer_email || '',
      customerAddress: invoiceData.customer_address || '',
      customerLogoUrl: invoiceData.customer_logo_url,
      items: itemsData.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      subtotal: invoiceData.subtotal,
      taxRate: invoiceData.tax_rate,
      taxAmount: invoiceData.tax_amount,
      total: invoiceData.total,
      notes: invoiceData.notes || '',
      template: 'modern', // Default template since it's not stored in DB
      bankAccountId: invoiceData.bank_account_id
    };

    return invoice;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw new Error('Could not fetch invoice from database');
  }
};

export const updateInvoice = async (invoiceId: string, invoice: Invoice): Promise<void> => {
  try {
    // Update invoice
    const { error: invoiceError } = await supabase
      .from('invoices')
      .update({
        invoice_number: invoice.invoiceNumber,
        date: invoice.date,
        due_date: invoice.dueDate,
        customer_name: invoice.customerName,
        customer_email: invoice.customerEmail,
        customer_address: invoice.customerAddress,
        customer_logo_url: invoice.customerLogoUrl,
        subtotal: invoice.subtotal,
        tax_rate: invoice.taxRate,
        tax_amount: invoice.taxAmount,
        total: invoice.total,
        notes: invoice.notes,
        bank_account_id: invoice.bankAccountId,
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId);

    if (invoiceError) throw invoiceError;

    // Delete existing items
    const { error: deleteItemsError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', invoiceId);

    if (deleteItemsError) throw deleteItemsError;

    // Insert updated items
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
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw new Error('Could not update invoice in database');
  }
};
