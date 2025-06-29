import { TINYGRAIL_ICON_BASE64 } from '@/constants';
import { cn } from '@/utils/helpers';
import { useDraggable } from '@dnd-kit/core';
import { Avatar } from '@heroui/react';
import { useEffect, useState } from 'react';

function DraggableButton({
  position,
  isOnLeft,
  onClick,
  src,
}: {
  position: { x: number; y: number };
  isOnLeft: boolean;
  onClick: () => void;
  src: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'tinygrailMagicButton',
  });
  const [hasDragged, setHasDragged] = useState(false);

  // 监听isDragging状态变化
  useEffect(() => {
    if (isDragging) {
      setHasDragged(true);
    } else {
      // 延迟重置状态，确保点击事件不会在拖拽后立即触发
      const timer = setTimeout(() => {
        setHasDragged(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  const style = {
    bottom: `${-position.y}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const handleClick = () => {
    if (!hasDragged) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'fixed z-100 flex',
        'bg-white opacity-50 shadow-lg',
        'cursor-pointer select-none',
        'pointer-events-auto',
        'transition-[opacity,translate] duration-300 ease-in-out',
        'hover:opacity-100',
        {
          'left-0 -translate-x-3 rounded-r-full !pl-4 hover:translate-x-0': isOnLeft,
          'right-0 translate-x-3 rounded-l-full !pr-4 hover:translate-x-0': !isOnLeft,
        },
        {
          'cursor-move rounded-full !p-0 opacity-100': isDragging,
        },
      )}
      {...listeners}
      {...attributes}
      onClick={handleClick}
    >
      <Avatar
        size="sm"
        classNames={{ base: 'size-7 !m-1 pointer-events-none' }}
        showFallback
        fallback={<Avatar size="sm" src={TINYGRAIL_ICON_BASE64} />}
        src={src}
      />
    </div>
  );
}

export default DraggableButton;
