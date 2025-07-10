import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Save, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Invoice } from '@/types/invoice';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { PDFService } from '@/services/pdfService';
import { saveInvoiceToDatabase } from '@/services/invoiceService';

const InvoiceCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkInvoiceLimit, checkSubscription, canCreateInvoice, incrementInvoiceCount, loading } = useSubscription();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    items: [],
    subtotal: 0,
    taxRate: 19,
    taxAmount: 0,
    total: 0,
    notes: '',
    template: 'modern'
  });

  // Check invoice limits on component mount and when subscription changes
  useEffect(() => {
    if (user) {
      console.log('Checking invoice limit - current state:', {
        canCreate: canCreateInvoice(),
        loading: loading
      });
      
      // Only redirect if not loading and cannot create invoice
      if (!loading && !canCreateInvoice()) {
        console.log('User cannot create invoice, redirecting to subscription page');
        toast({
          title: "Rechnungslimit erreicht",
          description: "Sie haben Ihr monatliches Limit erreicht. Bitte upgraden Sie Ihren Plan.",
          variant: "destructive"
        });
        navigate('/subscription');
      }
    }
  }, [user, canCreateInvoice, navigate, loading, toast]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save invoices.",
        variant: "destructive"
      });
      return;
    }

    // CRITICAL: Always refresh subscription data before checking limit
    console.log('Refreshing subscription data before saving...');
    await checkSubscription();
    
    // CRITICAL: Double-check invoice limit before saving
    console.log('Checking invoice limit before saving...');
    if (!canCreateInvoice()) {
      console.log('Invoice limit reached, preventing save');
      toast({
        title: "Rechnungslimit erreicht",
        description: "Sie haben Ihr monatliches Limit erreicht. Bitte upgraden Sie Ihren Plan.",
        variant: "destructive"
      });
      navigate('/subscription');
      return;
    }

    if (!invoice.customerName.trim()) {
      toast({
        title: "Validation error",
        description: "Please enter a customer name.",
        variant: "destructive"
      });
      return;
    }

    if (invoice.items.length === 0) {
      toast({
        title: "Validation error",
        description: "Please add at least one invoice item.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log('Attempting to save invoice...');
      const invoiceId = await saveInvoiceToDatabase(invoice, user.id);
      
      setInvoice(prev => ({ ...prev, id: invoiceId }));
      
      // Refresh subscription data after successful save to get updated count
      await checkSubscription();
      
      toast({
        title: "Invoice saved",
        description: "The invoice was successfully saved to the database."
      });
      
      console.log('Invoice saved successfully, checking if user can still create invoices...');
      
      // After incrementing, check if user has now reached their limit
      setTimeout(() => {
        if (!canCreateInvoice()) {
          console.log('User has reached limit after saving, redirecting to dashboard');
          toast({
            title: "Limit erreicht",
            description: "Sie haben Ihr monatliches Limit erreicht. Zurück zum Dashboard...",
            variant: "destructive"
          });
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      }, 100); // Small delay to ensure state is updated
      
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast({
        title: "Save failed",
        description: "Could not save the invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) {
      toast({
        title: "Error",
        description: "Preview could not be found.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await PDFService.generateInvoicePDF(invoice, previewRef.current);
      toast({
        title: "PDF successfully created",
        description: "The invoice was downloaded as PDF."
      });
    } catch (error) {
      toast({
        title: "PDF Error",
        description: "The PDF could not be created.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadAdvancedPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await PDFService.generateAdvancedInvoicePDF(invoice);
      toast({
        title: "PDF successfully created",
        description: "The invoice was downloaded as PDF."
      });
    } catch (error) {
      toast({
        title: "PDF Error",
        description: "The PDF could not be created.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Don't render the page if user cannot create invoices
  if (user && !canCreateInvoice()) {
    return null; // This will prevent the page from rendering while redirect happens
  }

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
              <h1 className="text-xl font-bold gradient-text">Create Invoice</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving || !canCreateInvoice()}
                className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Generating...' : 'PDF (Preview)'}
              </Button>
              <Button 
                size="sm" 
                onClick={handleDownloadAdvancedPDF}
                disabled={isGeneratingPDF}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Generating...' : 'PDF (Formatted)'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceForm invoice={invoice} onInvoiceChange={setInvoice} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-8">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[80vh] overflow-y-auto p-6">
                  <div ref={previewRef}>
                    <InvoicePreview invoice={invoice} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceCreator;
