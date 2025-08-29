import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import { BASE_URL } from '@/constants/constants';
import type { ChatMessage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>['sendMessage'];
}

function PureSuggestedActions({
  chatId,
  sendMessage,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'What is the Capital',
      label: 'of Nova Scotia?',
      action: 'What is the Capital of Nova Scotia?',
    },
    {
      title: 'Why is Open Source AI',
      label: 'important to Society ?',
      action: 'Why is Open Source AI important to Society?',
    },
    {
      title: 'Help me write an essay',
      label: `about Nova Scotia`,
      action: `Help me write an essay about Nova Scotia`,
    },
    {
      title: 'Give me the importance',
      label: `of Self-hosted AI`,
      action: `Give me the importance of Self-hosted AI`,
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `${BASE_URL}/chat/${chatId}`);
              
              sendMessage({
                id: uuidv4(), 
                role: 'user',
                parts: [
                  {
                    type: 'text',
                    text: suggestedAction.action,
                  },
                ],
              });
            }}
            className="text-left border rounded-xl px-3 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    return true;
  },
);
