import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ArrowLeft, AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}

export function ErrorPage({ error, resetError }: ErrorPageProps) {
  const handleReload = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Error Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <AlertTriangle className="h-24 w-24 text-destructive/70" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-xl text-muted-foreground max-w-md">
              We're sorry, but something unexpected happened. Please try again.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={handleReload} className="gap-2">
                <RefreshCw size={16} />
                Try Again
              </Button>
              <Link to="/">
                <Button variant="outline" size="lg" className="gap-2">
                  <Home size={16} />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Details (if available) */}
        {error && (
          <div className="mt-12 bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3 text-destructive">Error Details</h2>
            <div className="bg-muted/50 rounded-lg p-4">
              <code className="text-sm font-mono break-all">
                {error.message || 'Unknown error occurred'}
              </code>
            </div>
            
            {process.env.NODE_ENV === 'development' && error.stack && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Stack Trace (Development)
                </summary>
                <div className="mt-2 bg-muted/50 rounded-lg p-4">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all text-muted-foreground">
                    {error.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Need Help?</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Try refreshing the page</p>
            <p>• Check your internet connection</p>
            <p>• Clear your browser cache and cookies</p>
            <p>• Try using a different browser</p>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              If the problem persists, <Link to="/contact" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
