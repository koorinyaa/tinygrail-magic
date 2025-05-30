import { getTopWeek, TopWeekResponse } from '@/api/character';
import { HistoryTopWeek } from '@/components/history-top-week';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { toast } from 'sonner';
import { Content } from './components/content';
import { Header } from './components/header';

/**
 * 当前萌王组件
 */
export const CurrentTopWeek = () => {
  const isMobile = useIsMobile(448);
  const showDrawer = useIsMobile(1280);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 错误信息
  const [error, setError] = useState('');
  // 当前萌王数据
  const [topWeekData, setTopWeekData] = useState<TopWeekResponse>();
  // 评分倍率 = 总溢出金额 / 总参与人数
  const [scoreMultiplier, setScoreMultiplier] = useState(0);
  // 照片查看器是否打开
  const [isPhotoSliderOpen, setIsPhotoSliderOpen] = useState(false);
  // 照片查看器图片地址
  const [photoSliderSrc, setPhotoSliderSrc] = useState('');
  // 抽屉是否打开
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 加载当前萌王数据
  const fetchTopWeekData = async (
    isInit = false,
    autoUpdate = false,
    callback?: () => void
  ) => {
    try {
      if (!autoUpdate) setLoading(true);

      const response = await getTopWeek();

      if (response.State !== 0) {
        throw new Error(response.Message || '萌王投票数据加载失败');
      }
      let totalExtra = 0;
      let totalUser = 0;
      response.Value.forEach((item) => {
        totalExtra += item.Extra;
        totalUser += item.Type;
      });
      setScoreMultiplier(totalExtra / totalUser);
      setTopWeekData(response);
      setError('');
      callback?.();
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : '萌王投票数据加载失败';
      console.error(errMsg);
      if (isInit) {
        setError(errMsg);
      } else {
        toast.error('萌王投票加载失败', {
          description: errMsg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopWeekData(true);

    return () => {
      // 卸载组件时清除所有卡片折叠状态缓存
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('topWeekCard-isExpanded-')) {
          sessionStorage.removeItem(key);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!showDrawer) {
      setDrawerOpen(false);
    }
  }, [showDrawer]);

  return (
    <div className="w-full">
      <Header loading={loading} fetchTopWeekData={fetchTopWeekData} setDrawerOpen={setDrawerOpen} />
      {!error && (
        <Content
          loading={loading}
          topWeekData={topWeekData}
          scoreMultiplier={scoreMultiplier}
          setIsPhotoSliderOpen={setIsPhotoSliderOpen}
          setPhotoSliderSrc={setPhotoSliderSrc}
          fetchTopWeekData={fetchTopWeekData}
        />
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <PhotoSlider
        images={[
          {
            src: photoSliderSrc,
            key: photoSliderSrc,
          },
        ]}
        visible={isPhotoSliderOpen}
        onClose={() => setIsPhotoSliderOpen(false)}
        maskOpacity={0.4}
        bannerVisible={false}
        className="backdrop-blur-xs"
      />
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        direction={isMobile ? 'bottom' : 'right'}
        repositionInputs={false}
      >
        <DrawerContent
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          className={cn('bg-card border-none overflow-hidden', {
            'max-w-96 rounded-l-md': !isMobile,
            '!max-h-[90dvh] max-h-[90vh]': isMobile,
          })}
        >
          <VisuallyHidden asChild>
            <DrawerTitle />
          </VisuallyHidden>
          <HistoryTopWeek onCloseDrawer={() => setDrawerOpen(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
