import meta from '@/assets/meta.svg';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ModelSelector({
  className,
}: {
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-testid="model-selector"
      variant="outline"
      className={cn("md:px-2 md:h-[34px] cursor-default", className)}
    >
      <img src={meta} alt="Meta" className="w-4 h-4" />
      Llama 3.2 1B
    </Button>
  );
}
