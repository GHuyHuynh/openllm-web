import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back Navigation */}
      <div className="p-4">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Error Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
        <div className="space-y-6">
          <div className="text-[10rem] sm:text-[16rem] font-bold text-muted-foreground/30 leading-none">
            404
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">Page Not Found</h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <Home size={20} />
                  Go Home
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
