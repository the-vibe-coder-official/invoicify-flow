
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InvoiceData {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  customer_name: string;
  customer_email?: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
  overdueInvoices: number;
}

export const useInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [stats, setStats] = useState<InvoiceStats>({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    overdueInvoices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, date, due_date, customer_name, customer_email, total, status, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Fehler beim Laden der Rechnungen",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setInvoices(data || []);
      
      // Calculate stats
      const totalInvoices = data?.length || 0;
      const totalRevenue = data?.reduce((sum, invoice) => sum + Number(invoice.total), 0) || 0;
      const pendingInvoices = data?.filter(invoice => invoice.status === 'sent').length || 0;
      const overdueInvoices = data?.filter(invoice => {
        const dueDate = new Date(invoice.due_date);
        const today = new Date();
        return invoice.status === 'sent' && dueDate < today;
      }).length || 0;

      setStats({
        totalInvoices,
        totalRevenue,
        pendingInvoices,
        overdueInvoices
      });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Fehler",
        description: "Rechnungen konnten nicht geladen werden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    invoices,
    stats,
    loading,
    refetch: fetchInvoices
  };
};
