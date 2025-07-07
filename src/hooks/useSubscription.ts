
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'Free' | 'Pro' | 'Unlimited';
  subscription_end?: string;
  invoice_limit: number;
  invoice_count: number;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'Free',
    invoice_limit: 3,
    invoice_count: 0
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user || !session) {
      setLoading(false);
      return;
    }

    try {
      console.log('Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Fehler beim Überprüfen des Abonnements",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Subscription data received:', data);
      setSubscription(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fehler",
        description: "Abonnement-Status konnte nicht überprüft werden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (tier: 'Pro' | 'Unlimited') => {
    if (!user || !session) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um ein Abonnement abzuschließen",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { tier }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast({
          title: "Fehler beim Erstellen der Checkout-Session",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fehler",
        description: "Checkout-Session konnte nicht erstellt werden",
        variant: "destructive"
      });
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error opening customer portal:', error);
        toast({
          title: "Fehler beim Öffnen des Kundenportals",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fehler",
        description: "Kundenportal konnte nicht geöffnet werden",
        variant: "destructive"
      });
    }
  };

  const canCreateInvoice = () => {
    if (subscription.subscription_tier === 'Unlimited') return true;
    return subscription.invoice_count < subscription.invoice_limit;
  };

  const checkInvoiceLimit = () => {
    if (!canCreateInvoice()) {
      const upgradeMessage = subscription.subscription_tier === 'Free' 
        ? "Sie haben das Limit von 3 Rechnungen für den kostenlosen Plan erreicht. Upgraden Sie auf Pro für 20 Rechnungen pro Monat."
        : "Sie haben das Limit von 20 Rechnungen für den Pro-Plan erreicht. Upgraden Sie auf Unlimited für unbegrenzte Rechnungen.";
      
      toast({
        title: "Rechnungslimit erreicht",
        description: upgradeMessage,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (user && session) {
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, [user, session]);

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
    canCreateInvoice,
    checkInvoiceLimit
  };
};
