import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { HeaderActions } from "./header-actions";
import { HeaderBreadcrumb } from "./header-breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function Header({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      className={cn("flex h-12 shrink-0 items-center gap-2 border-b", className)}
      {...props}
    >
      <div className="flex items-center gap-2 px-4 h-4">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <HeaderBreadcrumb />
      </div>
      <div className="ml-auto px-3">
        <HeaderActions />
      </div>
    </header>
  )
}