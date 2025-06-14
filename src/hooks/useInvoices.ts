
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
          title: "Error loading invoices",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Type the data properly to match our InvoiceData interface
      const typedInvoices: InvoiceData[] = (data || []).map(invoice => ({
        ...invoice,
        status: invoice.status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
      }));

      setInvoices(typedInvoices);
      
      // Calculate stats
      const totalInvoices = typedInvoices?.length || 0;
      const totalRevenue = typedInvoices?.reduce((sum, invoice) => sum + Number(invoice.total), 0) || 0;
      const pendingInvoices = typedInvoices?.filter(invoice => invoice.status === 'sent').length || 0;
      const overdueInvoices = typedInvoices?.filter(invoice => {
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
        title: "Error",
        description: "Could not load invoices",
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
