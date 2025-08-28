import meta from '@/assets/meta.svg';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ExternalLink, Info } from 'lucide-react';

export function ModelSelector({
  className,
}: {
} & React.ComponentProps<typeof Button>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid="model-selector"
          variant="outline"
          className={cn("md:px-2 md:h-[34px]", className)}
        >
          <img src={meta} alt="Meta" className="w-4 h-4" />
          Llama 3.2 1B
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Model Information
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 space-y-2">
          <div>
            <h4 className="font-medium text-sm">Llama 3.2 1B Instruct</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Multilingual large language model optimized for dialogue use cases and summarization tasks.
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Size:</span>
              <span>1B parameters</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Type:</span>
              <span>Instruction-tuned</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">License:</span>
              <span>Llama 3.2 Community License Agreement</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href="https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            View on Hugging Face
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
