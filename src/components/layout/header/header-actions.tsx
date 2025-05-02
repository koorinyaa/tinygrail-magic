import { Moon, Search, Sun } from 'lucide-react';

import { AvatarDropdownMenu } from '@/components/avatar-dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { ComponentProps } from 'react';

export function HeaderActions({ className, ...props }: ComponentProps<'div'>) {
  const { setCharacterSearchDialog } = useStore();
  const { theme, setTheme } = useStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={cn('flex h-8 items-center gap-2 text-sm', className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        <Button
          className="size-8 bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-foreground/80 cursor-pointer"
          onClick={() => {
            setCharacterSearchDialog({ open: true });
          }}
        >
          <Search className="size-5" />
        </Button>
        <Button
          className="size-8 bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-foreground/80 cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="size-5" />
          ) : (
            <Sun className="size-5" />
          )}
        </Button>
      </div>
      {/* <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-foreground">
        <FaGithub />
      </Button> */}
      <AvatarDropdownMenu />
    </div>
  );
}
