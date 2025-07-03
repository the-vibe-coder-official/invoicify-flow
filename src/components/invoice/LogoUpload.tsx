
import { useState, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoUpload: (logoUrl: string) => void;
  onLogoRemove: () => void;
}

export const LogoUpload = ({ currentLogoUrl, onLogoUpload, onLogoRemove }: LogoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Fehler",
        description: "Sie müssen angemeldet sein, um Dateien hochzuladen.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte laden Sie nur Bilddateien hoch.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Bitte laden Sie Dateien unter 5MB hoch.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('customer-logos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('customer-logos')
        .getPublicUrl(fileName);

      onLogoUpload(publicUrl);

      toast({
        title: "Logo erfolgreich hochgeladen",
        description: "Das Kundenlogo wurde erfolgreich hinzugefügt."
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload-Fehler",
        description: "Das Logo konnte nicht hochgeladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    onLogoRemove();
    toast({
      title: "Logo entfernt",
      description: "Das Kundenlogo wurde entfernt."
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Kundenlogo</h3>
          
          {currentLogoUrl ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img 
                  src={currentLogoUrl} 
                  alt="Kundenlogo" 
                  className="max-w-32 max-h-20 object-contain rounded border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${isDragging 
                  ? 'border-blue-500 bg-blue-50/10' 
                  : 'border-gray-600 hover:border-gray-500'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="text-sm text-gray-400">Wird hochgeladen...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="rounded-full bg-gray-800 p-3">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      Logo per Drag & Drop hochladen
                    </p>
                    <p className="text-xs text-gray-400">
                      oder klicken Sie hier zum Auswählen
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG bis zu 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};
