import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { CopyIcon } from '@/components/ui/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ui/theme-provider';

interface CodeExample {
  language: string;
  label: string;
  code: string;
  languageIcon?: React.ReactNode;
}

interface CodeBlockProps {
  examples: CodeExample[];
  title?: string;
  className?: string;
}

export function CodeBlock({ examples, title, className }: CodeBlockProps) {
  const [selectedExample, setSelectedExample] = useState(examples[0]);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedExample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div
      className={cn(
        'relative group rounded-lg border bg-neutral-100 dark:bg-neutral-900 overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">
          {title || 'Code Example'}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {selectedExample.languageIcon} {selectedExample.label}
              <svg
                className="ml-1 h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {examples.map(example => (
              <DropdownMenuItem
                key={example.language}
                onClick={() => setSelectedExample(example)}
                className={
                  selectedExample.language === example.language
                    ? 'bg-accent'
                    : ''
                }
              >
                {example.languageIcon} {example.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-8 w-8 hover:bg-background/80"
          onClick={handleCopy}
        >
          {copied ? (
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <CopyIcon size={16} />
          )}
        </Button>

        <SyntaxHighlighter
          language={selectedExample.language}
          style={theme === 'dark' ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            textShadow: 'none',
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              textShadow: 'none',
            },
          }}
        >
          {selectedExample.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
