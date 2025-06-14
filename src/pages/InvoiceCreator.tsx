import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Save, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Invoice } from '@/types/invoice';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { PDFService } from '@/services/pdfService';
import { saveInvoiceToDatabase } from '@/services/invoiceService';

const InvoiceCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
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
    notes: ''
  });

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save invoices.",
        variant: "destructive"
      });
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
      const invoiceId = await saveInvoiceToDatabase(invoice, user.id);
      
      // Update the invoice with the database ID
      setInvoice(prev => ({ ...prev, id: invoiceId }));
      
      toast({
        title: "Invoice saved",
        description: "The invoice was successfully saved to the database."
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-xl font-bold text-slate-900">Create Invoice</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Generating...' : 'PDF (Preview)'}
              </Button>
              <Button 
                size="sm" 
                onClick={handleDownloadAdvancedPDF}
                disabled={isGeneratingPDF}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Generating...' : 'PDF (Formatted)'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceForm invoice={invoice} onInvoiceChange={setInvoice} />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
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
