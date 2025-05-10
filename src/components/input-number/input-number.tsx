import { cn } from '@/lib/utils';
import {
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import {
  Button,
  Group,
  Input,
  NumberField,
  NumberFieldProps,
} from 'react-aria-components';

export function InputNumber(
  props: NumberFieldProps & React.RefAttributes<HTMLDivElement>
) {
  return (
    <NumberField aria-label="number" {...props}>
      <div className="*:not-first:mt-2">
        <Group
          className={cn(
            'border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-8 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:ring-[3px]',
            props?.className
          )}
        >
          <Input className="bg-background text-foreground w-full grow py-1.5 px-2 text-center tabular-nums text-base" />
          <div className="flex h-[calc(100%+2px)] flex-col">
            <Button
              slot="increment"
              className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronUpIcon size={12} aria-hidden="true" />
            </Button>
            <Button
              slot="decrement"
              className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronDownIcon size={12} aria-hidden="true" />
            </Button>
          </div>
        </Group>
      </div>
    </NumberField>
  );
}
