import { useScroll } from "@/hooks/use-scroll";
import { cn, isEmpty } from "@/lib/utils";
import { useEffect } from "react";

interface CharacterDrawerBackgroundProps {
  backgroundImage: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}
/**
 * 角色抽屉背景
 * @param { CharacterDrawerBackgroundProps } props
 * @param {string} props.backgroundImage - 背景图片 URL
 * @param {React.RefObject<HTMLDivElement>} props.scrollContainerRef - 滚动容器的 ref
 * */
export default function CharacterDrawerBackground({ backgroundImage, scrollContainerRef }: CharacterDrawerBackgroundProps) {
  const { scrollPosition } = useScroll(scrollContainerRef);

  return (
    <>
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-40 w-full -z-10",
          "bg-cover bg-center transition-opacity duration-300",
          {"brightness-80 blur-2xl": !isEmpty(backgroundImage)}
        )}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundColor: !backgroundImage ? "var(--color-gray-200)" : undefined,
        }}
      />
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-4 w-full -z-10 bg-background transition-opacity duration-300",
          {
            "hidden": scrollPosition - 104 < 0
          }
        )}
        style={{
          opacity: Math.max(0, Math.min(1, (scrollPosition - 104) / 40))
        }}
      >
      </div>
    </>
  );
}