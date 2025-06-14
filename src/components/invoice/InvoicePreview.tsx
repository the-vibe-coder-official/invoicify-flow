
import { Invoice } from '@/types/invoice';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const template = invoice.template || 'modern';

  switch (template) {
    case 'classic':
      return <ClassicTemplate invoice={invoice} />;
    case 'minimal':
      return <MinimalTemplate invoice={invoice} />;
    case 'modern':
    default:
      return <ModernTemplate invoice={invoice} />;
  }
};
