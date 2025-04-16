import { Search } from "lucide-react";

import { useAppState } from "@/components/app-state-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { FaGithub } from "react-icons/fa";

export function HeaderActions({ className, ...props }: ComponentProps<"div">) {
  const { dispatch } = useAppState();

  return (
    <div
      className={cn("flex h-4 items-center gap-2 text-sm", className)}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={() => {
          dispatch({
            type: "SET_CHARACTER_SEARCH_DIALOG",
            payload: true
          })
        }}
      >
        <Search />
      </Button>
      <ThemeToggle
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
      />
      <Separator orientation="vertical" className="h-4" />
      <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-foreground">
        <FaGithub />
      </Button>
    </div>
  );
}
