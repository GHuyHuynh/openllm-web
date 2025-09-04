import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              Back to Chat
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            We're here to help! If you're experiencing issues with our AI
            chatbot or have any questions, please reach out to us.
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-2">
                  For technical issues, model errors, or general inquiries:
                </p>
                <div>
                  <a
                    href="mailto:Huy.Huynh@dal.ca"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Huy.Huynh@dal.ca
                  </a>
                  <span className="mx-2 text-muted-foreground">or</span>
                  <a
                    href="mailto:Tobi.Onibudo@dal.ca"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Tobi.Onibudo@dal.ca
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Response Time</h3>
                <p className="text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Model Not Available</h3>
                <p className="text-muted-foreground">
                  If you're seeing "model does not exist" errors, this may be
                  temporary. Please try again in a few minutes or contact us if
                  the issue persists.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Connection Issues</h3>
                <p className="text-muted-foreground">
                  Check your internet connection and try refreshing the page. If
                  problems continue, please let us know.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Feature Requests</h3>
                <p className="text-muted-foreground">
                  We'd love to hear your ideas for improving our chatbot. Send
                  us your suggestions!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
