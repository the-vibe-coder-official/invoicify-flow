
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-48 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -top-24 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8 shadow-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-slate-700">Free 14-day trial</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Create Professional{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Invoices
            </span>{" "}
            in Minutes
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Streamline your billing process with our modern invoice generator. 
            Create, send, and track invoices effortlessly while getting paid faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg"
            >
              Start Creating Invoices
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-slate-700 hover:text-slate-900 hover:bg-white/50 backdrop-blur-sm border border-white/30 px-8 py-6 text-lg group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-6">Trusted by 10,000+ businesses worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="h-8 w-20 bg-slate-300 rounded"></div>
              <div className="h-8 w-20 bg-slate-300 rounded"></div>
              <div className="h-8 w-20 bg-slate-300 rounded"></div>
              <div className="h-8 w-20 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Hero Image/Preview */}
        <div className="mt-20 relative">
          <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-2xl p-8 mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
                <p className="text-slate-600">Invoice Preview Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
