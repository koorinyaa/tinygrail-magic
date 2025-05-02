import { useScroll } from '@/hooks/use-scroll';
import { cn, getCoverUrl, isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import { RefObject, useEffect, useState } from 'react';

/**
 * 角色背景
 * @param {Object} props
 * @param {React.RefObject<HTMLDivElement>} props.contentRef - 内容容器的 ref
 * */
export function CharacterBackground({
  contentRef,
}: {
  contentRef: RefObject<HTMLDivElement>;
}) {
  const { scrollPosition } = useScroll(contentRef);
  const { characterDrawerData } = useStore();
  const { characterTemples = [], characterlinks = [] } = characterDrawerData;
  const [backgroundImage, setBackgroundImage] = useState('');

  /**
   * 监听圣殿数据变化，更新背景图片
   */
  useEffect(() => {
    const merged = [...characterTemples, ...characterlinks];
    const uniqueMap = new Map(merged.map((item) => [item.Name, item]));

    let maxSacrificesTemple = null;

    for (const item of uniqueMap.values()) {
      if (
        !maxSacrificesTemple ||
        item.Sacrifices > maxSacrificesTemple.Sacrifices
      ) {
        maxSacrificesTemple = item;
      }
    }

    setBackgroundImage(getCoverUrl(maxSacrificesTemple?.Cover || ''));
  }, [characterTemples, characterlinks]);

  return (
    <>
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-40 w-full -z-10',
          'bg-cover bg-center brightness-80 blur-2xl transition-opacity duration-300',
          {
            'bg-gray-200 dark:bg-gray-600': isEmpty(backgroundImage),
          }
        )}
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          opacity: Math.max(0, (104 - scrollPosition) / 104),
        }}
      />
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-4 w-full -z-10 bg-card transition-opacity duration-300',
          {
            hidden: scrollPosition - 104 < 0,
          }
        )}
        style={{
          opacity: Math.max(0, Math.min(1, (scrollPosition - 104) / 40)),
        }}
      ></div>
    </>
  );
}
