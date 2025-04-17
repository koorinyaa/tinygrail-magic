import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import CharacterDrawerContent from "./character-drawer-content";
import { useStore } from "@/store";

/**
 * 角色抽屉
 */
export function CharacterDrawer() {
  const { characterDrawer, setCharacterDrawer } = useStore();
  const isMobile = useIsMobile(448);
  const { open, characterId } = characterDrawer;

  const onOpenChange = (open: boolean) => {
    setCharacterDrawer({ open, characterId: null });
  };

  return (
    <>
      <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={cn("bg-background border-none overflow-hidden", { "rounded-l-md": !isMobile })}>
          <CharacterDrawerContent
            characterId={characterId}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}


