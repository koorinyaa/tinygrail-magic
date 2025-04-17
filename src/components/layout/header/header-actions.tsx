import { Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { ComponentProps } from "react";
import { FaGithub } from "react-icons/fa";

export function HeaderActions({ className, ...props }: ComponentProps<"div">) {
  const { setCharacterSearchDialog } = useStore();
  const { theme, setTheme } = useStore()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div
      className={cn("flex h-4 items-center gap-2 text-sm", className)}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={() => { setCharacterSearchDialog({ open: true }) }}
      >
        <Search />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={toggleTheme}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-foreground">
        <FaGithub />
      </Button>
    </div>
  );
}
