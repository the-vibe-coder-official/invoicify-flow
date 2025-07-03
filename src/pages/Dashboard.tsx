import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { InvoiceOverview } from '@/components/dashboard/InvoiceOverview';
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
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

  const handleCreateInvoice = () => {
    navigate('/invoice/create');
  };

  const handleManageCustomers = () => {
    navigate('/customers');
  };

  const handleManageSubscription = () => {
    navigate('/subscription');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                InvoiceFlow
              </span>
            </div>
            
            <DashboardNavigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, <span className="gradient-text">{profile?.full_name || 'User'}</span>!
          </h1>
          <p className="text-xl text-gray-300">
            Manage your invoices and monitor your business performance
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
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Create New Invoice</CardTitle>
                <CardDescription className="text-gray-300">
                  Create a new invoice for your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold h-12 shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={handleCreateInvoice}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Analytics & Reports</CardTitle>
                <CardDescription className="text-gray-300">
                  View detailed analytics and business insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 h-12"
                  onClick={handleViewAnalytics}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Manage Subscription</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your plan and billing limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 h-12"
                  onClick={handleManageSubscription}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Subscription
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Manage Customers</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your customer database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 h-12"
                  onClick={handleManageCustomers}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Customers
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
