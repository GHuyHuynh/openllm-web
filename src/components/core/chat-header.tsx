import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/core/model-selector';
import { SidebarToggle } from '@/components/core/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/ui/icons';
import { useSidebar } from '@/components/ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNavigate } from 'react-router';

interface ChatHeaderProps {
  isReadonly: boolean;
}

function PureChatHeader({
  isReadonly,
}: ChatHeaderProps) {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                navigate('/');
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <ModelSelector
          className="order-1 md:order-2"
        />
      )}

      <ThemeToggle
        className="dark:bg-zinc-900 bg-zinc-100 dark:hover:bg-zinc-800 hover:bg-zinc-200 dark:text-zinc-50 text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
      />
    </header>
  );
}

export const ChatHeader = memo(
  PureChatHeader,
  (prevProps: ChatHeaderProps, nextProps: ChatHeaderProps) => {
    return (
      prevProps.isReadonly === nextProps.isReadonly
    );
  }
);
