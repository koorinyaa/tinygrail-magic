import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { HeaderActions } from "./header-actions";
import { HeaderBreadcrumb } from "./header-breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function Header({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      className={cn("flex h-16 shrink-0 items-center px-4 border-b", className)}
      {...props}
    >
      <div className="flex items-center gap-4 h-8">
        <SidebarTrigger
          className={cn(
            "-ml-2 cursor-pointer",
            "bg-transparent hover:bg-transparent dark:hover:bg-transparent shadow-none text-muted-foreground hover:text-foreground/80"
          )}
        />
        <HeaderBreadcrumb />
      </div>
      <div className="ml-auto">
        <HeaderActions />
      </div>
    </header>
  )
}