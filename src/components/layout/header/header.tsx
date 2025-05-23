import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import { HeaderActions } from './header-actions';
import { HeaderBreadcrumb } from './header-breadcrumb';

export function Header({
  className,
  ...props
}: ComponentProps<'header'>) {
  return (
    <header
      className={cn('flex h-14 shrink-0 items-center px-4 border-b', className)}
      {...props}
    >
      <div className="flex-1 flex items-center gap-2 h-8 -ml-2 overflow-hidden">
        <SidebarTrigger
          className={cn(
            'cursor-pointer',
            'bg-transparent hover:bg-transparent dark:hover:bg-transparent shadow-none text-muted-foreground hover:text-foreground/80'
          )}
        />
        <HeaderBreadcrumb className='w-full overflow-hidden' />
      </div>
      <div className="ml-auto">
        <HeaderActions />
      </div>
    </header>
  );
}
