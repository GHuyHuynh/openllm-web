import { X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type BannerType = 'alert';

interface BannerProps {
  type: BannerType;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  defaultVisible?: boolean;
}

export const Banner = ({
  type,
  title = 'Due to high demand, we decided to limit API access and chat access to selected users.',
  description = 'If you are interested in using the API or chat, please contact us.',
  linkText = 'Contact us',
  linkUrl = '/contact',
  defaultVisible = true,
}: BannerProps) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const styles = {
    alert: {
      container:
        'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900',
      text: 'text-red-900 dark:text-red-100',
      link: 'text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
    },
  };

  const currentStyle = styles[type];

  return (
    <section className={`w-full border-b px-4 py-3 ${currentStyle.container}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-center">
          <span className={`text-sm ${currentStyle.text}`}>
            <span className="font-medium">{title}</span>{' '}
            <span className="opacity-90">
              {description}{' '}
              <a
                href={linkUrl}
                className={`underline underline-offset-2 ${currentStyle.link}`}
                target="_blank"
              >
                {linkText}
              </a>
              .
            </span>
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 h-8 w-8 flex-none"
          onClick={handleClose}
        >
          <X className={`h-4 w-4 ${currentStyle.text}`} />
        </Button>
      </div>
    </section>
  );
};
