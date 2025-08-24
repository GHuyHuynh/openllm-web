import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/components/ui/theme-provider';

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const { theme } = useTheme();
  
  if (!inline) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    const resolvedTheme = theme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;
    
    return (
      <div className="not-prose flex flex-col min-w-0">
        <div className="text-sm min-w-0 overflow-x-auto border border-zinc-200 dark:border-zinc-700 rounded-xl">
          <SyntaxHighlighter
            style={resolvedTheme === 'dark' ? oneDark : oneLight}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem',
              width: '100%',
              minWidth: 0,
            }}
            codeTagProps={{
              style: { 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
