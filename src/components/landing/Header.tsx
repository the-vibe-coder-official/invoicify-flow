
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handlePricingClick = () => {
    navigate('/pricing');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              InvoiceFlow
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">
              Features
            </a>
            <button onClick={handlePricingClick} className="text-gray-300 hover:text-white transition-colors duration-200">
              Pricing
            </button>
            <a href="#stories" className="text-gray-300 hover:text-white transition-colors duration-200">
              Stories
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200">
              FAQ
            </a>
            {!user && (
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800" onClick={handleSignIn}>
                Sign In
              </Button>
            )}
            <Button 
              className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg transition-all duration-300"
              onClick={handleGetStarted}
            >
              {user ? 'Dashboard' : 'Get Started'}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
            <nav className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <button onClick={handlePricingClick} className="block text-gray-300 hover:text-white transition-colors text-left">
                Pricing
              </button>
              <a href="#stories" className="block text-gray-300 hover:text-white transition-colors">
                Stories
              </a>
              <a href="#faq" className="block text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
              <div className="pt-4 space-y-2">
                {!user && (
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={handleSignIn}>
                    Sign In
                  </Button>
                )}
                <Button 
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold"
                  onClick={handleGetStarted}
                >
                  {user ? 'Dashboard' : 'Get Started'}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
