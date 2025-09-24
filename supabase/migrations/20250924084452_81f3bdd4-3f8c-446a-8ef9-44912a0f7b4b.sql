-- Create a function to enforce invoice limits at database level
CREATE OR REPLACE FUNCTION public.enforce_invoice_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    invoice_limit INTEGER;
    user_subscription RECORD;
BEGIN
    -- Get current subscription data for the user
    SELECT invoice_count, invoice_limit 
    INTO user_subscription
    FROM public.subscribers 
    WHERE user_id = NEW.user_id;
    
    -- If no subscription found, deny creation
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No subscription found for user. Please contact support.';
    END IF;
    
    -- Count actual invoices for this user this month
    SELECT COUNT(*) INTO current_count
    FROM public.invoices 
    WHERE user_id = NEW.user_id 
    AND date_trunc('month', created_at) = date_trunc('month', NOW());
    
    -- Check if limit would be exceeded
    IF current_count >= user_subscription.invoice_limit THEN
        RAISE EXCEPTION 'Monthly invoice limit of % reached. Please upgrade your plan.', user_subscription.invoice_limit;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to enforce invoice limits on insert
DROP TRIGGER IF EXISTS enforce_invoice_limit_trigger ON public.invoices;
CREATE TRIGGER enforce_invoice_limit_trigger
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_invoice_limit();

-- Create a function to sync invoice counts with actual data
CREATE OR REPLACE FUNCTION public.sync_invoice_counts()
RETURNS VOID AS $$
BEGIN
    -- Update all subscriber invoice counts based on actual invoices this month
    UPDATE public.subscribers 
    SET invoice_count = (
        SELECT COALESCE(COUNT(*), 0)
        FROM public.invoices 
        WHERE invoices.user_id = subscribers.user_id 
        AND date_trunc('month', invoices.created_at) = date_trunc('month', NOW())
    ),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run initial sync
SELECT public.sync_invoice_counts();

-- Create security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    event_type TEXT NOT NULL,
    event_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert audit logs
CREATE POLICY "Service role can insert audit logs" ON public.security_audit_log
FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Users can view their own audit logs
CREATE POLICY "Users can view their own audit logs" ON public.security_audit_log
FOR SELECT USING (auth.uid() = user_id);