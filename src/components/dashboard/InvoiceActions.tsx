
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { InvoiceData } from '@/hooks/useInvoices';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface InvoiceActionsProps {
  invoice: InvoiceData;
  onUpdate: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'cancelled': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'Bezahlt';
    case 'sent': return 'Gesendet';
    case 'overdue': return 'Überfällig';
    case 'draft': return 'Entwurf';
    case 'cancelled': return 'Storniert';
    default: return status;
  }
};

export const InvoiceActions = ({ invoice, onUpdate }: InvoiceActionsProps) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: "Rechnung gelöscht",
        description: "Die Rechnung wurde erfolgreich gelöscht.",
      });
      
      onUpdate();
      setDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/invoice/edit/${invoice.id}`);
  };

  return (
    <>
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          onClick={() => setViewOpen(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-red-400 hover:bg-gray-700/50"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold gradient-text">
              Rechnung #{invoice.invoice_number}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Rechnungsdetails ansehen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Status</h4>
                <Badge className={getStatusColor(invoice.status)}>
                  {getStatusText(invoice.status)}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Betrag</h4>
                <p className="text-lg font-bold text-white">€{Number(invoice.total).toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Kunde</h4>
                <p className="text-white">{invoice.customer_name}</p>
                {invoice.customer_email && (
                  <p className="text-sm text-gray-300">{invoice.customer_email}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Rechnungsnummer</h4>
                <p className="text-white">{invoice.invoice_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Rechnungsdatum</h4>
                <p className="text-white">{new Date(invoice.date).toLocaleDateString('de-DE')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Fälligkeitsdatum</h4>
                <p className="text-white">{new Date(invoice.due_date).toLocaleDateString('de-DE')}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Erstellt am</h4>
              <p className="text-white">{new Date(invoice.created_at).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Schließen
            </Button>
            <Button onClick={handleEdit} className="bg-gradient-to-r from-blue-500 to-purple-600">
              Bearbeiten
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Rechnung löschen</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Sind Sie sicher, dass Sie die Rechnung #{invoice.invoice_number} löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50"
              disabled={loading}
            >
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Wird gelöscht...' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
