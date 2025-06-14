
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, LogOut, User, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { InvoiceOverview } from '@/components/dashboard/InvoiceOverview';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Successfully signed out",
      description: "See you later!"
    });
  };

  const handleCreateInvoice = () => {
    navigate('/invoice/create');
  };

  const handleManageCustomers = () => {
    navigate('/customers');
  };

  const handleManageSubscription = () => {
    navigate('/subscription');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InvoiceFlow
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <User className="h-4 w-4" />
                <span className="text-sm">
                  {profile?.full_name || user?.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-slate-600">
            Manage your invoices and monitor your business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Overview - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <InvoiceOverview />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>
                  Create a new invoice for your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  onClick={handleCreateInvoice}
                >
                  Create Invoice
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Manage Subscription</CardTitle>
                <CardDescription>
                  Manage your plan and billing limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleManageSubscription}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Subscription
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Manage Customers</CardTitle>
                <CardDescription>
                  Manage your customer database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleManageCustomers}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Customers
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>View Reports</CardTitle>
                <CardDescription>
                  Analyze your business performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
