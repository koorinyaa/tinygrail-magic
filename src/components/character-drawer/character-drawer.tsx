import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CharacterDrawerContent from "./character-drawer-content";

/**
 * 角色抽屉
 */
export function CharacterDrawer() {
  const { characterDrawer, setCharacterDrawer, resetCharacterDrawerData } = useStore();
  const isMobile = useIsMobile(448);
  const { open, characterId } = characterDrawer;

  const onOpenChange = (open: boolean) => {
    resetCharacterDrawerData();
    setCharacterDrawer({ open, characterId: null });
  };

  return (
    <>
      <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className={cn("bg-background border-none overflow-hidden", { "rounded-l-md": !isMobile })}
          aria-describedby={undefined}
        >
          <VisuallyHidden asChild>
            <DrawerTitle />
          </VisuallyHidden>
          <CharacterDrawerContent
            characterId={characterId}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}


