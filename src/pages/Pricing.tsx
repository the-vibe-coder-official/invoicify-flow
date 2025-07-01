
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

const plans = [
  {
    name: 'Free',
    price: '€0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '3 invoices per month',
      'Basic templates',
      'Email support'
    ],
    icon: <Check className="h-5 w-5" />,
    color: 'border-gray-200',
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Pro',
    price: '€9.99',
    period: '/month',
    description: 'Ideal for small businesses',
    features: [
      '20 invoices per month',
      'Advanced templates',
      'Priority support',
      'Customer management',
      'Detailed reports'
    ],
    icon: <Star className="h-5 w-5" />,
    color: 'border-blue-200',
    popular: true,
    buttonText: 'Start Pro',
    buttonVariant: 'default' as const
  },
  {
    name: 'Unlimited',
    price: '€19.99',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Unlimited invoices',
      'Premium templates',
      '24/7 support',
      'API access',
      'White-label option',
      'Advanced analytics'
    ],
    icon: <Zap className="h-5 w-5" />,
    color: 'border-purple-200',
    buttonText: 'Go Unlimited',
    buttonVariant: 'default' as const
  }
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    if (user) {
      navigate('/subscription');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Scale your invoice management with our flexible plans. 
              Start free and upgrade as your business grows.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`${plan.color} ${plan.popular ? 'ring-2 ring-blue-500' : ''} relative bg-gray-900/50 backdrop-blur-xl border-gray-700/50`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-blue-500/20' : 'bg-gray-800/50'}`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  <div className="flex items-baseline justify-center space-x-1 mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant}
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-gray-400">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-400">
                  We accept all major credit cards and process payments securely through Stripe.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-400">
                  Yes! Start with our Free plan and upgrade when you need more features.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-400">
                  Absolutely. Cancel your subscription anytime with no cancellation fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
