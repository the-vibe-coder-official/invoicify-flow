
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoDashboard = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Unleash the{" "}
            <span className="gradient-text">
              power of real-time
            </span>
            {" "}invoices
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            InvoiceFlow delivers streamlined billing solutions, letting your team 
            create, send and track professional invoices—without the complexity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={handleGoDashboard}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-600 text-white hover:bg-gray-900 hover:border-gray-500 px-8 py-4 text-lg rounded-lg transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
