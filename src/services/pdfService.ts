
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '@/types/invoice';

export class PDFService {
  static async generateInvoicePDF(invoice: Invoice, previewElement: HTMLElement): Promise<void> {
    try {
      // Create canvas from the preview element
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: previewElement.scrollWidth,
        height: previewElement.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${invoice.invoiceNumber || 'Rechnung'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Fehler beim Generieren der PDF:', error);
      throw new Error('PDF konnte nicht generiert werden');
    }
  }

  static async generateAdvancedInvoicePDF(invoice: Invoice): Promise<void> {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font
      pdf.setFont('helvetica');
      
      let yPosition = 20;
      const leftMargin = 20;
      const rightMargin = 190;

      // Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RECHNUNG', leftMargin, yPosition);
      
      yPosition += 15;
      
      // Invoice details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Rechnungsnummer: ${invoice.invoiceNumber}`, leftMargin, yPosition);
      yPosition += 5;
      pdf.text(`Datum: ${new Date(invoice.date).toLocaleDateString('de-DE')}`, leftMargin, yPosition);
      yPosition += 5;
      pdf.text(`Fällig: ${new Date(invoice.dueDate).toLocaleDateString('de-DE')}`, leftMargin, yPosition);
      
      yPosition += 20;

      // Customer info
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Rechnungsempfänger:', leftMargin, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoice.customerName, leftMargin, yPosition);
      yPosition += 5;
      if (invoice.customerEmail) {
        pdf.text(invoice.customerEmail, leftMargin, yPosition);
        yPosition += 5;
      }
      if (invoice.customerAddress) {
        const addressLines = invoice.customerAddress.split('\n');
        addressLines.forEach(line => {
          pdf.text(line, leftMargin, yPosition);
          yPosition += 5;
        });
      }
      
      yPosition += 15;

      // Items table
      const tableStartY = yPosition;
      const colWidths = [80, 30, 30, 30];
      const colPositions = [leftMargin, leftMargin + colWidths[0], leftMargin + colWidths[0] + colWidths[1], leftMargin + colWidths[0] + colWidths[1] + colWidths[2]];

      // Table header
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Beschreibung', colPositions[0], yPosition);
      pdf.text('Menge', colPositions[1], yPosition);
      pdf.text('Preis', colPositions[2], yPosition);
      pdf.text('Gesamt', colPositions[3], yPosition);
      
      yPosition += 8;
      pdf.line(leftMargin, yPosition - 2, rightMargin, yPosition - 2);

      // Table rows
      pdf.setFont('helvetica', 'normal');
      invoice.items.forEach(item => {
        pdf.text(item.description, colPositions[0], yPosition);
        pdf.text(item.quantity.toString(), colPositions[1], yPosition);
        pdf.text(`€${item.price.toFixed(2)}`, colPositions[2], yPosition);
        pdf.text(`€${item.total.toFixed(2)}`, colPositions[3], yPosition);
        yPosition += 6;
      });

      yPosition += 10;
      pdf.line(leftMargin, yPosition - 5, rightMargin, yPosition - 5);

      // Totals
      const totalsX = rightMargin - 60;
      pdf.text('Zwischensumme:', totalsX - 40, yPosition);
      pdf.text(`€${invoice.subtotal.toFixed(2)}`, totalsX, yPosition);
      yPosition += 6;
      
      pdf.text(`Steuer (${invoice.taxRate}%):`, totalsX - 40, yPosition);
      pdf.text(`€${invoice.taxAmount.toFixed(2)}`, totalsX, yPosition);
      yPosition += 6;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Gesamtsumme:', totalsX - 40, yPosition);
      pdf.text(`€${invoice.total.toFixed(2)}`, totalsX, yPosition);

      // Notes
      if (invoice.notes) {
        yPosition += 20;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notizen:', leftMargin, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        const noteLines = invoice.notes.split('\n');
        noteLines.forEach(line => {
          pdf.text(line, leftMargin, yPosition);
          yPosition += 5;
        });
      }

      const fileName = `${invoice.invoiceNumber || 'Rechnung'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Fehler beim Generieren der PDF:', error);
      throw new Error('PDF konnte nicht generiert werden');
    }
  }
}
