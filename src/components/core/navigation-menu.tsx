import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export function NavigationMenu() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="order-5 md:ml-auto ml-2 h-full md:h-[34px] px-2"
        >
          <Menu size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate('/contact')}>
          Contact
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/about')}>
          About
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/developer')}>
          Developer API
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
