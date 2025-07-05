
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Save, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Invoice } from '@/types/invoice';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { PDFService } from '@/services/pdfService';
import { getInvoiceById, updateInvoice } from '@/services/invoiceService';

const InvoiceEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: '',
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

  useEffect(() => {
    const loadInvoice = async () => {
      if (!id || !user) return;

      try {
        const invoiceData = await getInvoiceById(id);
        setInvoice(invoiceData);
      } catch (error) {
        console.error('Error loading invoice:', error);
        toast({
          title: "Fehler beim Laden",
          description: "Die Rechnung konnte nicht geladen werden.",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoice();
  }, [id, user, navigate, toast]);

  const handleSave = async () => {
    if (!user || !id) {
      toast({
        title: "Authentifizierung erforderlich",
        description: "Bitte melden Sie sich an, um Rechnungen zu speichern.",
        variant: "destructive"
      });
      return;
    }

    if (!invoice.customerName.trim()) {
      toast({
        title: "Validierungsfehler",
        description: "Bitte geben Sie einen Kundennamen ein.",
        variant: "destructive"
      });
      return;
    }

    if (invoice.items.length === 0) {
      toast({
        title: "Validierungsfehler",
        description: "Bitte fügen Sie mindestens einen Rechnungsposten hinzu.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateInvoice(id, invoice);
      
      toast({
        title: "Rechnung aktualisiert",
        description: "Die Rechnung wurde erfolgreich aktualisiert."
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Speichern fehlgeschlagen",
        description: "Die Rechnung konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) {
      toast({
        title: "Fehler",
        description: "Vorschau konnte nicht gefunden werden.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await PDFService.generateInvoicePDF(invoice, previewRef.current);
      toast({
        title: "PDF erfolgreich erstellt",
        description: "Die Rechnung wurde als PDF heruntergeladen."
      });
    } catch (error) {
      toast({
        title: "PDF-Fehler",
        description: "Das PDF konnte nicht erstellt werden.",
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
        title: "PDF erfolgreich erstellt",
        description: "Die Rechnung wurde als PDF heruntergeladen."
      });
    } catch (error) {
      toast({
        title: "PDF-Fehler",
        description: "Das PDF konnte nicht erstellt werden.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
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
                Zurück
              </Button>
              <h1 className="text-xl font-bold gradient-text">Rechnung bearbeiten</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Speichern...' : 'Speichern'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Generiere...' : 'PDF (Vorschau)'}
              </Button>
              <Button 
                size="sm" 
                onClick={handleDownloadAdvancedPDF}
                disabled={isGeneratingPDF}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? 'Generiere...' : 'PDF (Formatiert)'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Rechnungsdetails</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceForm invoice={invoice} onInvoiceChange={setInvoice} />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Live-Vorschau</CardTitle>
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

export default InvoiceEditor;
