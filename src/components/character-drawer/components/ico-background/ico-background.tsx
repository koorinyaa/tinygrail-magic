import { useScroll } from '@/hooks/use-scroll';
import { cn, isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import { RefObject } from 'react';

/**
 * ico背景
 * @param {Object} props
 * @param {React.RefObject<HTMLDivElement>} props.contentRef - 内容容器的 ref
 * */
export function IcoBackground({
  contentRef,
}: {
  contentRef: RefObject<HTMLDivElement>;
}) {
  const { scrollPosition } = useScroll(contentRef);
  const { icoDrawerData } = useStore();
  const { Icon: icon = '' } = icoDrawerData.icoDetailData || {};

  return (
    <>
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-40 w-full -z-10',
          'bg-cover bg-center brightness-80 blur-2xl transition-opacity duration-300',
          {
            'bg-gray-200 dark:bg-gray-600': isEmpty(icon),
          }
        )}
        style={{
          backgroundImage: icon ? `url(${icon})` : undefined,
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
