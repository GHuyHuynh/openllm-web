import { cva } from 'class-variance-authority';
import { type HTMLMotionProps, motion } from 'motion/react';

import { cn } from '@/lib/utils';

const waveLoaderVariants = cva('flex gap-2 items-center justify-center', {
  variants: {
    messagePlacement: {
      bottom: 'flex-col',
      right: 'flex-row',
      left: 'flex-row-reverse',
    },
  },
  defaultVariants: {
    messagePlacement: 'bottom',
  },
});

export interface WaveLoaderProps {
  /**
   * The number of bouncing dots to display.
   * @default 5
   */
  bars?: number;
  /**
   * Optional message to display alongside the bouncing dots.
   */
  message?: string;
  /**
   * Position of the message relative to the spinner.
   * @default bottom
   */
  messagePlacement?: 'bottom' | 'left' | 'right';
}

export function WaveLoader({
  bars = 5,
  message,
  messagePlacement,
  className,
  ...props
}: HTMLMotionProps<'div'> & WaveLoaderProps) {
  return (
    <div className={cn(waveLoaderVariants({ messagePlacement }))}>
      <div className={cn('flex gap-1 items-center justify-center')}>
        {Array(bars)
          .fill(undefined)
          .map((_, index) => (
            <motion.div
              key={index}
              className={cn('w-2 h-5 bg-foreground origin-bottom', className)}
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.3,
              }}
              {...props}
            />
          ))}
      </div>
      {message && <div>{message}</div>}
    </div>
  );
}

export function WaveLoaderScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <WaveLoader bars={5} message="Loading application..." />
    </div>
  );
}
