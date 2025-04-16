import { CharacterDetail } from "@/api/character";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScroll } from "@/hooks/use-scroll";
import { cn, getAvatarUrl } from "@/lib/utils";

interface CharacterDrawerHeaderProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  data: CharacterDetail | null;
}
/**
 * 角色抽屉头部
 * @param { CharacterDrawerHeaderProps } props
 * @param { React.RefObject<HTMLDivElement> } props.scrollContainerRef - 滚动容器的 ref
 * @param { CharacterDetail | null } props.data - 角色详情数据
 */
export default function CharacterDrawerHeader({ scrollContainerRef, data }: CharacterDrawerHeaderProps) {
  const isMobile = useIsMobile(448);
  const { scrollPosition } = useScroll(scrollContainerRef);

  const {
    CharacterId: characterId = 0,
    Icon: icon = "",
    Name: name = "",
  } = data || {};

  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 h-10 px-4 py-2",
        "flex flex-row gap-1 items-center bg-background z-10",
        "border-b border-slate-300/30 dark:border-slate-700/30",
        {"top-4 pt-0": isMobile}
      )}
      style={{
        opacity: Math.max(0, Math.min(1, (scrollPosition - 104) / 40))
      }}
    >
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Avatar className="size-8 rounded-full border-2 border-secondary">
          <AvatarImage
            className="object-cover object-top pointer-events-none"
            src={getAvatarUrl(icon)}
            alt={name}
          />
          <AvatarFallback className="rounded-full">C</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex flex-row items-center mt-0.5 ml-0.5 text-xs text-foreground font-semibold">
          <span className="truncate">{name}</span>
        </div>
        <div className="flex items-center text-xs opacity-60">
          <span className="scale-90">#{characterId}</span>
        </div>
      </div>
    </div>
  );
}