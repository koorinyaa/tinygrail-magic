import { getTopWeek, TopWeekResponse } from '@/api/character';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

  return (
    <div className="w-full">
      <Header loading={loading} fetchTopWeekData={fetchTopWeekData} />
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
      ></PhotoSlider>
    </div>
  );
};
