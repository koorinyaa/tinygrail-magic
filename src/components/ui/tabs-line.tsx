"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

const TabsLine = TabsPrimitive.Root;

const TabsLineList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg bg-muted p-0.5 text-muted-foreground/70",
      className,
    )}
    {...props}
  />
));
TabsLineList.displayName = TabsPrimitive.List.displayName;

const TabsLineTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap relative",
      "px-3 py-1.5",
      "text-xs font-medium text-muted-foreground/70 data-[state=active]:text-foreground",
      "outline-offset-2 transition-all hover:text-muted-foreground",
      "focus-visible:outline focus-visible:outline-ring/70",
      "disabled:pointer-events-none disabled:opacity-50",
      "after:absolute after:inset-x-0 after:bottom-0",
      "after:left-1/2 after:-translate-x-1/2",
      "after:h-0.5 after:w-4 after:rounded-full",
      "data-[state=active]:after:bg-primary",
      className,
    )}
    {...props}
  />
));
TabsLineTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsLineContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 outline-offset-2 focus-visible:outline focus-visible:outline-ring/70",
      className,
    )}
    {...props}
  />
));
TabsLineContent.displayName = TabsPrimitive.Content.displayName;

export { TabsLine, TabsLineContent, TabsLineList, TabsLineTrigger };
