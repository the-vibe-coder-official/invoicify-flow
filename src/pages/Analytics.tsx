
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { InvoiceStatusChart } from '@/components/analytics/InvoiceStatusChart';
import { MonthlyMetrics } from '@/components/analytics/MonthlyMetrics';
import { TopCustomers } from '@/components/analytics/TopCustomers';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { FileText, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();

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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">
                    Analytics & Reports
                  </h1>
                  <p className="text-sm text-gray-300">Business insights and performance metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="mb-8">
          <AnalyticsOverview />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-700/50 backdrop-blur-xl">
            <TabsTrigger 
              value="overview"
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="revenue"
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600"
            >
              Revenue
            </TabsTrigger>
            <TabsTrigger 
              value="invoices"
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600"
            >
              Invoices
            </TabsTrigger>
            <TabsTrigger 
              value="customers"
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600"
            >
              Customers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <InvoiceStatusChart />
            </div>
            <MonthlyMetrics />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <RevenueChart />
              <MonthlyMetrics />
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvoiceStatusChart />
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Invoice Metrics</CardTitle>
                  <CardDescription className="text-gray-300">Key performance indicators for your invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Average Invoice Value</span>
                      <span className="font-semibold text-white">€2,450.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Average Payment Time</span>
                      <span className="font-semibold text-white">18 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Collection Rate</span>
                      <span className="font-semibold text-green-400">94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <TopCustomers />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
