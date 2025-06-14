
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types/customer';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { CustomerList } from '@/components/customers/CustomerList';

const Customers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const fetchCustomers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error loading",
        description: "Customers could not be loaded.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomer = async (customerData: Customer) => {
    if (!user) return;
    
    setSaving(true);
    try {
      if (editingCustomer) {
        // Update existing customer
        const { error } = await supabase
          .from('customers')
          .update({
            ...customerData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCustomer.id)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: "Customer updated",
          description: "The customer data was successfully updated."
        });
      } else {
        // Create new customer
        const { error } = await supabase
          .from('customers')
          .insert({
            ...customerData,
            user_id: user.id
          });

        if (error) throw error;
        
        toast({
          title: "Customer added",
          description: "The new customer was successfully added."
        });
      }

      setShowForm(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error saving",
        description: "The customer could not be saved.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Customer deleted",
        description: "The customer was successfully deleted."
      });
      
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error deleting",
        description: "The customer could not be deleted.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-900">Manage Customers</h1>
              </div>
            </div>
            
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Customer
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto">
            <CustomerForm
              customer={editingCustomer}
              onSubmit={handleSaveCustomer}
              onCancel={handleCancel}
              loading={saving}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Your Customers ({customers.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerList
                  customers={customers}
                  onEdit={handleEditCustomer}
                  onDelete={handleDeleteCustomer}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Customers;
