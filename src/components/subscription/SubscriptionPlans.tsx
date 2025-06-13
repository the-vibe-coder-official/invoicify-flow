
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const plans = [
  {
    name: 'Free',
    price: '€0',
    period: '/Monat',
    description: 'Perfekt für den Einstieg',
    features: [
      '3 Rechnungen pro Monat',
      'Grundlegende Vorlagen',
      'E-Mail-Support'
    ],
    icon: <Check className="h-5 w-5" />,
    color: 'border-gray-200'
  },
  {
    name: 'Pro',
    price: '€9.99',
    period: '/Monat',
    description: 'Ideal für kleine Unternehmen',
    features: [
      '20 Rechnungen pro Monat',
      'Erweiterte Vorlagen',
      'Prioritätssupport',
      'Kundenverwaltung',
      'Detaillierte Berichte'
    ],
    icon: <Star className="h-5 w-5" />,
    color: 'border-blue-200',
    popular: true
  },
  {
    name: 'Unlimited',
    price: '€19.99',
    period: '/Monat',
    description: 'Für wachsende Unternehmen',
    features: [
      'Unbegrenzte Rechnungen',
      'Premium-Vorlagen',
      '24/7 Support',
      'API-Zugang',
      'White-Label-Option',
      'Erweiterte Analytik'
    ],
    icon: <Zap className="h-5 w-5" />,
    color: 'border-purple-200'
  }
];

export const SubscriptionPlans = () => {
  const { subscription, createCheckoutSession, openCustomerPortal } = useSubscription();

  const isCurrentPlan = (planName: string) => {
    return subscription.subscription_tier === planName;
  };

  const handlePlanSelect = (planName: string) => {
    if (planName === 'Free') return;
    if (isCurrentPlan(planName)) {
      openCustomerPortal();
    } else {
      createCheckoutSession(planName as 'Pro' | 'Unlimited');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.name} 
          className={`${plan.color} ${plan.popular ? 'ring-2 ring-blue-500' : ''} relative`}
        >
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
              Beliebt
            </Badge>
          )}
          
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className={`p-2 rounded-full ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {plan.icon}
              </div>
            </div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-600">{plan.period}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full" 
              variant={isCurrentPlan(plan.name) ? "outline" : "default"}
              onClick={() => handlePlanSelect(plan.name)}
              disabled={plan.name === 'Free'}
            >
              {isCurrentPlan(plan.name) ? 'Aktueller Plan - Verwalten' : 
               plan.name === 'Free' ? 'Kostenlos' : 'Auswählen'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
