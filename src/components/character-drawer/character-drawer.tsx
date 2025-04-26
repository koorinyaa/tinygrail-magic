import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CharacterDrawerContent from "./character-drawer-content";

/**
 * 角色抽屉
 */
export function CharacterDrawer({ container }: { container?: HTMLElement | null }) {
  const { characterDrawer, setCharacterDrawer, characterDrawerData, resetCharacterDrawerData } = useStore();
  const isMobile = useIsMobile(448);
  const { open, characterId } = characterDrawer;

  const onOpenChange = (open: boolean) => {
    resetCharacterDrawerData();
    setCharacterDrawer({ open, characterId: null });
  };

  /**
   * 处理外部交互兼容问题
   * @param ev
   */
  const handleInteractOutside = (ev: Event) => {
    // 防止在单击toaster时关闭对话框
    const isToastItem = (ev.target as Element)?.closest('[data-sonner-toaster]')
    if (isToastItem) ev.preventDefault()
  }

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={onOpenChange}
      handleOnly={characterDrawerData.handleOnly}
      container={container}
      repositionInputs={false}
    >
      <DrawerContent
        className={cn(
          "bg-background border-none overflow-hidden",
          {
            "max-w-96 rounded-l-md": !isMobile,
            "!max-h-[90dvh]":isMobile,
          }
        )}
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        onPointerDownOutside={handleInteractOutside}
        onInteractOutside={handleInteractOutside}
      >
        <VisuallyHidden asChild>
          <DrawerTitle />
        </VisuallyHidden>
        <CharacterDrawerContent
          characterId={characterId}
        />
      </DrawerContent>
    </Drawer>
  );
}


