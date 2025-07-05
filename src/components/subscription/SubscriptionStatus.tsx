
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CreditCard, FileText, RefreshCw } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useInvoices } from '@/hooks/useInvoices';

export const SubscriptionStatus = () => {
  const { subscription, loading, checkSubscription, openCustomerPortal } = useSubscription();
  const { stats, loading: invoicesLoading } = useInvoices();

  if (loading || invoicesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Pro': return 'bg-blue-100 text-blue-800';
      case 'Unlimited': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = () => {
    if (subscription.subscription_tier === 'Unlimited') return 0;
    return (stats.totalInvoices / subscription.invoice_limit) * 100;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No end date';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Your Subscription</span>
            </CardTitle>
            <CardDescription>Current plan and usage</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={checkSubscription}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Plan</p>
            <div className="flex items-center space-x-2">
              <Badge className={getTierColor(subscription.subscription_tier)}>
                {subscription.subscription_tier}
              </Badge>
              {subscription.subscribed && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              )}
            </div>
          </div>
          {subscription.subscribed && (
            <Button variant="outline" size="sm" onClick={openCustomerPortal}>
              Manage
            </Button>
          )}
        </div>

        {/* Subscription End */}
        {subscription.subscription_end && (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Renews until</p>
              <p className="font-medium">{formatDate(subscription.subscription_end)}</p>
            </div>
          </div>
        )}

        {/* Invoice Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <p className="text-sm text-gray-600">Invoice Usage</p>
            </div>
            <p className="text-sm font-medium">
              {stats.totalInvoices} / {subscription.invoice_limit === -1 ? '∞' : subscription.invoice_limit}
            </p>
          </div>
          
          {subscription.subscription_tier !== 'Unlimited' && (
            <Progress 
              value={getUsagePercentage()} 
              className="h-2"
            />
          )}
          
          {subscription.subscription_tier === 'Unlimited' && (
            <div className="text-center py-2">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                Unlimited invoices
              </Badge>
            </div>
          )}
        </div>

        {/* Usage Warning */}
        {subscription.subscription_tier !== 'Unlimited' && 
         stats.totalInvoices >= subscription.invoice_limit * 0.8 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              You have reached {Math.round(getUsagePercentage())}% of your monthly limit.
              {stats.totalInvoices >= subscription.invoice_limit && (
                <span className="font-medium"> Upgrade your plan to create more invoices.</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
