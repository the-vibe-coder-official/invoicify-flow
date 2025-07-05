
-- Create a table for bank accounts
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('us', 'eu', 'uk')),
  
  -- US bank account fields
  routing_number TEXT,
  account_number TEXT,
  
  -- EU bank account fields (IBAN)
  iban TEXT,
  bic_swift TEXT,
  
  -- UK bank account fields
  sort_code TEXT,
  uk_account_number TEXT,
  
  -- Common fields
  bank_name TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for bank accounts
CREATE POLICY "Users can view their own bank accounts" 
  ON public.bank_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bank accounts" 
  ON public.bank_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts" 
  ON public.bank_accounts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts" 
  ON public.bank_accounts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add bank account reference to invoices table
ALTER TABLE public.invoices 
ADD COLUMN bank_account_id UUID REFERENCES public.bank_accounts(id);
