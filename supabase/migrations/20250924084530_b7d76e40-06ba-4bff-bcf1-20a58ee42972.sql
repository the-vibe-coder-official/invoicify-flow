-- Fix search path security warnings by updating functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix search path for sync function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;