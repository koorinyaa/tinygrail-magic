import { useAppState } from "@/components/app-state-provider";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import CharacterDrawerContent from "./character-drawer-content";

/**
 * 角色抽屉
 */
export function CharacterDrawer() {
  const { state, dispatch } = useAppState();
  const isMobile = useIsMobile(448);
  const { open, characterId } = state.characterDrawer;

  const onOpenChange = (open: boolean) => {
    dispatch({ type: "SET_CHARACTER_DRAWER", payload: { open, characterId: null } });
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


