
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';

const Subscription = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
              <h1 className="text-xl font-bold text-slate-900">Abonnement</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Abmelden</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Wählen Sie Ihren Plan
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Skalieren Sie Ihr Rechnungsmanagement mit unseren flexiblen Plänen
            </p>
          </div>

          {/* Current Subscription Status */}
          <div className="max-w-2xl mx-auto">
            <SubscriptionStatus />
          </div>

          {/* Pricing Plans */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Verfügbare Pläne
            </h2>
            <SubscriptionPlans />
          </div>

          {/* FAQ or Additional Info */}
          <div className="text-center text-sm text-slate-600 max-w-2xl mx-auto">
            <p>
              Alle Pläne beinhalten unsere Kernfunktionen für Rechnungserstellung und -verwaltung. 
              Sie können jederzeit upgraden oder downgraden.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;
