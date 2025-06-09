
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  BarChart3, 
  Send, 
  CreditCard, 
  Globe,
  Clock,
  Shield,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Choose from beautiful, customizable invoice templates that reflect your brand perfectly."
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Keep track of all your clients and their payment history in one organized dashboard."
  },
  {
    icon: BarChart3,
    title: "Financial Analytics",
    description: "Get insights into your revenue, outstanding payments, and business performance."
  },
  {
    icon: Send,
    title: "Instant Delivery",
    description: "Send invoices directly via email with automatic delivery confirmations."
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description: "Monitor payment status and send automated reminders for overdue invoices."
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Support for multiple currencies with real-time exchange rate conversion."
  },
  {
    icon: Clock,
    title: "Recurring Invoices",
    description: "Set up automated billing for subscription services and repeat customers."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Bank-level security with automated backups and 99.9% uptime guarantee."
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Create and manage invoices on the go with our fully responsive mobile app."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Get Paid Faster
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Our comprehensive invoice management system provides all the tools you need 
            to streamline your billing process and grow your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-white/70 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
