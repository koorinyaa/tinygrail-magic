import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  loading: boolean;
  fetchTopWeekData: (
    isInit?: boolean,
    autoUpdate?: boolean,
    callback?: () => void
  ) => void;
  setDrawerOpen?: (open: boolean) => void;
}
/**
 * 头部区域组件
 * @param {HeaderProps} props
 * @param {boolean} props.loading - 加载状态
 * @param {(isInit?: boolean, autoUpdate?: boolean, callback?: () => void) => void} props.fetchTopWeekData - 加载萌王投票数据
 */
export function Header({
  loading,
  fetchTopWeekData,
  setDrawerOpen,
}: HeaderProps) {
  // 自动更新
  const [autoUpdate, setAutoUpdate] = useState(false);
  // 最后更新时间
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  // 当前时间戳
  const [currentTime, setCurrentTime] = useState(Date.now());
  // 轮询定时器ID
  const intervalRef = useRef<number>();

  // 更新当前时间定时器
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // 轮询定时器
  useEffect(() => {
    if (autoUpdate && !loading) {
      intervalRef.current = window.setInterval(() => {
        fetchTopWeekData(false, true, () => {
          setLastUpdated(Date.now());
        });
      }, 3000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [autoUpdate]);

  // 格式化距离上次更新的时间文本
  const formatTimeSinceLastUpdate = () => {
    if (!lastUpdated) return '';
    const diff = Math.floor((currentTime - lastUpdated) / 1000);

    if (diff < 60) return '';
    if (diff >= 3600) return '（1小时前更新）';
    return `（${Math.floor(diff / 60)}分钟前更新）`;
  };

  return (
    <div className="flex flex-col gap-y-0.5 mb-6">
      <div className="flex flex-wrap flex-row items-center justify-between">
        <h2 className="text-xl font-bold flex-1 min-w-45 w-full">
          萌王投票
          <span className="text-xs opacity-60">
            {formatTimeSinceLastUpdate()}
          </span>
        </h2>
        <div className="flex items-center justify-between space-x-4 h-9">
          <div className="flex mr-1 items-center space-x-2">
            <Switch
              id="auto-update"
              checked={autoUpdate}
              onCheckedChange={setAutoUpdate}
              disabled={loading}
              className="cursor-pointer"
            />
            <Label htmlFor="auto-update" className="cursor-pointer">
              自动更新
            </Label>
          </div>
          {!autoUpdate && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  fetchTopWeekData(false, false, () => {
                    setLastUpdated(Date.now());
                  });
                }}
                className="hover:bg-transparent opacity-60 hover:opacity-100 cursor-pointer"
              >
                <RotateCw />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div>
        <Badge
          variant="outline"
          className="flex xl:hidden rounded-full gap-x-0.5 pl-3 cursor-pointer"
          onClick={() => setDrawerOpen?.(true)}
        >
          往期萌王  
          <ChevronRight />
        </Badge>
      </div>
    </div>
  );
}
