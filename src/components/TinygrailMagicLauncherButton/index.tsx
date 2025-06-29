import DraggableButton from '@/components/TinygrailMagicLauncherButton/components/DraggableButton';
import { LAUNCHER_BUTTON_POSITION_STORAGE_KEY, TINYGRAIL_ICON_BASE64 } from '@/constants';
import { initializePage } from '@/utils/initializers';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useEffect, useRef, useState } from 'react';

// 按钮位置边界常量
const MIN_Y_OFFSET = 100; // 距离顶部的最小距离
const MAX_Y_OFFSET = 64; // 距离底部的最小距离

function TinygrailMagicLauncherButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOnLeft, setIsOnLeft] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3, // 需要移动3px才会激活拖拽
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5, // 触摸移动5px内视为点击而非拖拽
      },
    }),
  );

  // 更新位置
  const updatePosition = () => {
    try {
      const savedPosition = localStorage.getItem(LAUNCHER_BUTTON_POSITION_STORAGE_KEY);

      // 设置上下边界
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const minY = -windowHeight + MIN_Y_OFFSET; // 顶部边界
      const maxY = -MAX_Y_OFFSET; // 底部边界

      if (savedPosition) {
        const parsedData = JSON.parse(savedPosition);

        // 将百分比转换为像素位置
        const yPixel = (parsedData.yPercent * windowHeight) / 100;
        // 应用上下边界限制
        const limitedY = Math.max(minY, Math.min(maxY, yPixel));

        // 根据isOnLeft决定x坐标
        const xPos = parsedData.isOnLeft ? 0 : windowWidth;
        setPosition({ x: xPos, y: limitedY });
        setIsOnLeft(parsedData.isOnLeft);
      } else {
        // 默认位置，应用上下边界限制
        const defaultY = -320;
        const limitedY = Math.max(minY, Math.min(maxY, defaultY));
        setPosition({ x: windowWidth, y: limitedY });
        setIsOnLeft(false);
      }
    } catch (e) {
      console.error('解析按钮位置失败', e);
    }
  };

  useEffect(() => {
    updatePosition();
  }, []);

  useEffect(() => {
    // 添加窗口大小变化事件监听器
    const handleResize = () => {
      const windowHeight = window.innerHeight;

      // 检查当前位置是否超出边界
      if (-position.y > windowHeight - MIN_Y_OFFSET) {
        updatePosition();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position.y]);

  /**
   * 处理拖拽结束
   * @param event - 拖拽结束事件
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;

    // 计算新位置
    let newY = position.y + delta.y;
    let newX = position.x + delta.x;

    // 限制上下边界
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const minY = -windowHeight + MIN_Y_OFFSET; // 顶部边界
    const maxY = -MAX_Y_OFFSET; // 底部边界

    newY = Math.max(minY, Math.min(maxY, newY));

    // 判断应该贴左边还是右边
    const shouldStickToLeft = newX < windowWidth / 2;
    setIsOnLeft(shouldStickToLeft);

    // 根据贴边设置X坐标
    newX = shouldStickToLeft ? 0 : windowWidth;

    // 设置新位置
    setPosition({ x: newX, y: newY });

    // 计算y位置为百分比
    const yPercent = (newY / windowHeight) * 100;

    // 保存位置
    localStorage.setItem(
      LAUNCHER_BUTTON_POSITION_STORAGE_KEY,
      JSON.stringify({ yPercent, isOnLeft: shouldStickToLeft }),
    );
  };

  /**
   * 点击按钮
   */
  const handleButtonClick = () => {
    console.info('Initializing tinygrail-magic...');
    initializePage();
  };

  return (
    <div ref={containerRef}>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <DraggableButton
          position={position}
          isOnLeft={isOnLeft}
          onClick={handleButtonClick}
          src={TINYGRAIL_ICON_BASE64}
        />
      </DndContext>
    </div>
  );
}

export default TinygrailMagicLauncherButton;
