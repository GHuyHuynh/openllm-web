import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ArrowLeft, MessageCircleX } from 'lucide-react';

export function ChatNotFoundPage() {
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
            <MessageCircleX className="h-24 w-24 text-muted-foreground/50" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Chat Not Found
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              The chat you're looking for doesn't exist or may have been
              deleted.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <Link to="/">
                <Button size="lg" className="gap-2">
                  <MessageCircleX size={16} />
                  Start New Chat
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Or check your chat history in the sidebar to find your previous
              conversations.
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">What happened?</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• The chat ID in the URL may be incorrect</p>
            <p>• The chat may have been deleted</p>
            <p>• You may not have permission to access this chat</p>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
