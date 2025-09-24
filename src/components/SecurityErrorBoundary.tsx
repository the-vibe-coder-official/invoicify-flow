import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class SecurityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Security error boundary caught an error:', error, errorInfo);
    
    // Log security-related errors
    if (this.isSecurityError(error)) {
      console.warn('[SECURITY] Potential security issue detected:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  private isSecurityError(error: Error): boolean {
    const securityKeywords = [
      'validation',
      'sanitization',
      'xss',
      'injection',
      'unauthorized',
      'permission',
      'limit exceeded'
    ];
    
    return securityKeywords.some(keyword => 
      error.message.toLowerCase().includes(keyword)
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isSecurityError = this.state.error && this.isSecurityError(this.state.error);

      return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant={isSecurityError ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {isSecurityError ? "Security Error" : "Something went wrong"}
              </AlertTitle>
              <AlertDescription className="mt-2">
                {isSecurityError 
                  ? "A security validation error occurred. Please refresh the page and try again. If the problem persists, contact support."
                  : "An unexpected error occurred. Please refresh the page and try again."
                }
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={this.handleReset}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Refresh Page
              </Button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-medium">
                  Debug Information (Development Only)
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}