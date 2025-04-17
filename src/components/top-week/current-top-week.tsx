import { getTopWeek, TopWeekResponse } from "@/api/character";
import { useAppState } from "@/components/app-state-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { getCoverUrl } from "@/lib/utils";
import { AlertCircle, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { toast } from "sonner";
import { TopWeekCard } from "./top-week-card";

/**
 * 当前萌王组件
 */
export const CurrentTopWeek = () => {
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 错误信息
  const [error, setError] = useState("");
  // 当前萌王数据
  const [topWeekData, setTopWeekData] = useState<TopWeekResponse>();
  // 评分倍率 = 总溢出金额 / 总参与人数
  const [scoreMultiplier, setScoreMultiplier] = useState(0);
  // 照片查看器是否打开
  const [isPhotoSliderOpen, setIsPhotoSliderOpen] = useState(false);
  // 照片查看器图片地址
  const [photoSliderSrc, setPhotoSliderSrc] = useState("");

  // 加载当前萌王数据
  const fetchTopWeekData = async (isInit = false, autoUpdate = false, callback?: () => void) => {
    try {
      if (!autoUpdate) setLoading(true);

      const response = await getTopWeek();

      if (response.State !== 0) {
        throw new Error(response.Message || "萌王投票数据加载失败");
      }
      let totalExtra = 0;
      let totalUser = 0;
      response.Value.forEach((item) => {
        totalExtra += item.Extra;
        totalUser += item.Type;
      });
      setScoreMultiplier(totalExtra / totalUser);
      setTopWeekData(response);
      setError("");
      callback?.();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "萌王投票数据加载失败";
      console.error(errMsg);
      if (isInit) {
        setError(errMsg);
      } else {
        toast.error("萌王投票加载失败", {
          description: errMsg,
        })
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopWeekData(true);

    return () => {
      // 卸载组件时清除所有卡片折叠状态缓存
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('topWeekCard-isExpanded-')) {
          sessionStorage.removeItem(key);
        }
      });
    };
  }, [])

  return (
    <div className="w-full">
      <HeaderSection loading={loading} fetchTopWeekData={fetchTopWeekData} />
      {!error && <ContentSection
        loading={loading}
        topWeekData={topWeekData}
        scoreMultiplier={scoreMultiplier}
        setIsPhotoSliderOpen={setIsPhotoSliderOpen}
        setPhotoSliderSrc={setPhotoSliderSrc}
      />}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <PhotoSlider
        images={[{
          src: photoSliderSrc,
          key: photoSliderSrc,
        }]}
        visible={isPhotoSliderOpen}
        onClose={() => setIsPhotoSliderOpen(false)}
        maskOpacity={0.4}
        bannerVisible={false}
        className="backdrop-blur-xs"
      >
      </PhotoSlider>
    </div>
  )
}

interface HeaderSectionProps {
  loading: boolean;
  fetchTopWeekData: (isInit?: boolean, autoUpdate?: boolean, callback?: () => void) => void;
}
/**
 * 头部区域组件
 * @param {HeaderSectionProps} props
 * @param {boolean} props.loading - 加载状态
 * @param {(isInit?: boolean, autoUpdate?: boolean, callback?: () => void) => void} props.fetchTopWeekData - 加载萌王投票数据
 */
const HeaderSection = ({ loading, fetchTopWeekData }: HeaderSectionProps) => {
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
        fetchTopWeekData(false, true, () => { setLastUpdated(Date.now()); });
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
    <div className="mb-6 flex flex-wrap flex-row items-center justify-between">
      <h2 className="text-xl font-bold flex-1 min-w-45 w-full">
        萌王投票
        <span className="text-xs opacity-60">{formatTimeSinceLastUpdate()}</span>
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
          <Label htmlFor="auto-update" className="cursor-pointer">自动更新</Label>
        </div>
        {!autoUpdate && <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              fetchTopWeekData(false, false, () => { setLastUpdated(Date.now()); });
            }}
            className="hover:bg-transparent opacity-60 hover:opacity-100 cursor-pointer"
          >
            <RotateCw />
          </Button>
        </div>}
      </div>
    </div>
  )
}

interface ContentSectionProps {
  loading: boolean;
  topWeekData: TopWeekResponse | undefined;
  scoreMultiplier: number;
  setIsPhotoSliderOpen: (isOpen: boolean) => void;
  setPhotoSliderSrc: (src: string) => void;
}
/** 
 * 内容区域组件
 * @param {ContentSectionProps} props
 * @param {boolean} props.loading - 加载状态
 * @param {TopWeekResponse} props.topWeekData - 萌王投票数据
 * @param {number} props.scoreMultiplier - 评分倍率
 * @param {(isOpen: boolean) => void} props.setIsPhotoSliderOpen - 设置照片查看器是否打开
 * @param {(src: string) => void} props.setPhotoSliderSrc - 设置照片查看器图片地址
 */
const ContentSection = ({ loading, topWeekData, scoreMultiplier, setIsPhotoSliderOpen, setPhotoSliderSrc }: ContentSectionProps) => {
  const { dispatch } = useAppState();

  return (
    <div
      className="grid w-full flex-1 gap-4 2xl:gap-x-6
              grid-cols-[repeat(auto-fill,minmax(136px,1fr))]
              lg:grid-cols-[repeat(auto-fill,minmax(176px,1fr))]
              xl:grid-cols-[repeat(auto-fill,minmax(172px,1fr))]
              2xl:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
    >
      {(loading || !topWeekData) ? Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="w-full aspect-[3/4] group">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      )) : topWeekData?.Value.map((item, index) => (
        <TopWeekCard
          key={item.CharacterId}
          className="min-w-32 max-w-60"
          rank={index + 1}
          scoreMultiplier={scoreMultiplier}
          data={item}
          handleCoverPreview={() => {
            if (item.Cover) {
              setIsPhotoSliderOpen(true);
              setPhotoSliderSrc(getCoverUrl(item.Cover, "large"));
            }
          }}
          handleCharacterDrawer={(characterId) => {
            dispatch({
              type: "SET_CHARACTER_DRAWER",
              payload: { open: true, characterId: characterId }
            })
          }}
          handleAuction={() => {
            toast.error("暂未开放");
          }}
        />
      ))}
    </div>
  )
}
