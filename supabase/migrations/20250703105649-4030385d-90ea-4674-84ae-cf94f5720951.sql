
-- Create a storage bucket for customer logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-logos', 'customer-logos', true);

-- Create RLS policies for the customer-logos bucket
CREATE POLICY "Users can upload their own customer logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'customer-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own customer logos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'customer-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own customer logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'customer-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own customer logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'customer-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add customer_logo_url column to invoices table
ALTER TABLE public.invoices 
ADD COLUMN customer_logo_url TEXT;
