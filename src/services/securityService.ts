import { supabase } from '@/integrations/supabase/client';

export interface SecurityAuditEvent {
  eventType: 'invoice_limit_exceeded' | 'invoice_created' | 'suspicious_activity' | 'validation_error' | 'auth_attempt';
  eventData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class SecurityService {
  static async logSecurityEvent(userId: string | null, event: SecurityAuditEvent): Promise<void> {
    try {
      // Get client info
      const ipAddress = await this.getClientIP();
      const userAgent = navigator.userAgent;

      console.log(`[SECURITY] ${event.eventType}:`, {
        userId,
        ...event.eventData,
        timestamp: new Date().toISOString()
      });

      // Only log to database if user is authenticated and we have a service that can handle it
      if (userId) {
        // Note: This would require a service role client or edge function to insert into audit log
        // For now, we'll rely on console logging and client-side monitoring
        // In production, you'd send this to an edge function that uses service role permissions
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      // In production, you might get this from a header or service
      return 'client-side'; // Placeholder since we can't get real IP client-side
    } catch {
      return 'unknown';
    }
  }

  static async validateInvoiceLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Double-check subscription limits
      const { data: subscription, error } = await supabase
        .from('subscribers')
        .select('invoice_count, invoice_limit, subscription_tier')
        .eq('user_id', userId)
        .single();

      if (error) {
        await this.logSecurityEvent(userId, {
          eventType: 'suspicious_activity',
          eventData: { action: 'subscription_check_failed', error: error.message }
        });
        return { allowed: false, reason: 'Unable to verify subscription' };
      }

      if (subscription.invoice_count >= subscription.invoice_limit) {
        await this.logSecurityEvent(userId, {
          eventType: 'invoice_limit_exceeded',
          eventData: { 
            currentCount: subscription.invoice_count,
            limit: subscription.invoice_limit,
            tier: subscription.subscription_tier
          }
        });
        return { 
          allowed: false, 
          reason: `Monthly invoice limit of ${subscription.invoice_limit} reached for ${subscription.subscription_tier || 'Free'} plan` 
        };
      }

      return { allowed: true };
    } catch (error) {
      await this.logSecurityEvent(userId, {
        eventType: 'suspicious_activity',
        eventData: { action: 'limit_validation_error', error: String(error) }
      });
      return { allowed: false, reason: 'Security validation failed' };
    }
  }

  static async syncUserInvoiceCount(userId: string): Promise<void> {
    try {
      // Call the database function to sync invoice counts
      const { error } = await supabase.rpc('sync_invoice_counts');
      
      if (error) {
        console.error('Failed to sync invoice counts:', error);
        await this.logSecurityEvent(userId, {
          eventType: 'suspicious_activity',
          eventData: { action: 'sync_failed', error: error.message }
        });
      }
    } catch (error) {
      console.error('Error syncing invoice counts:', error);
    }
  }

  static detectSuspiciousActivity(userId: string, action: string, metadata?: Record<string, any>): void {
    // Basic suspicious activity detection
    const suspiciousPatterns = [
      'multiple_rapid_requests',
      'unusual_data_patterns',
      'repeated_limit_attempts'
    ];

    if (suspiciousPatterns.some(pattern => action.includes(pattern))) {
      this.logSecurityEvent(userId, {
        eventType: 'suspicious_activity',
        eventData: { action, ...metadata }
      });
    }
  }

  static validateEnvironment(): { secure: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check if we're in HTTPS
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push('Application should use HTTPS in production');
    }

    // Check for development mode
    if (import.meta.env.DEV) {
      issues.push('Running in development mode - ensure production builds use optimized settings');
    }

    return {
      secure: issues.length === 0,
      issues
    };
  }
}