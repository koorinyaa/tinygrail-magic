import { TempleItem } from '@/api/character';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import {
  cn,
  formatCurrency,
  getAvatarUrl,
  getCoverUrl,
  isEmpty,
} from '@/lib/utils';
import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { PhotoProvider, PhotoView } from 'react-photo-view';

interface TempleCardProps {
  data: TempleItem | null;
  className?: string;
}
/**
 * 圣殿卡片
 * @param { TempleCardProps } porps
 * @param {TempleItem | null} porps.data - 圣殿数据
 * @param {string} porps.className - 自定义类名
 */
export function TempleCard({ data, className }: TempleCardProps) {
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Cover: cover = '',
    Avatar: avatar = '',
    Level: templeLevel = 0,
    Refine: refine = 0,
    StarForces: starForces = 0,
    Line: line = '',
  } = data || {};
  const [showLine, setShowLine] = useState(false);

  return (
    <AspectRatio
      ratio={3 / 4}
      className={cn(
        'relative rounded-sm overflow-hidden border border-slate-200/50 dark:border-slate-700/50',
        className
      )}
    >
      {cover ? (
        <PhotoProvider
          bannerVisible={false}
          maskOpacity={0.4}
          className="pointer-events-auto backdrop-blur-xs"
        >
          <PhotoView src={getCoverUrl(cover, 'large')}>
            <img
              src={getCoverUrl(cover, 'medium')}
              alt="圣殿"
              draggable="false"
              className="w-full h-full object-cover object-top cursor-pointer"
            />
          </PhotoView>
        </PhotoProvider>
      ) : (
        <div className="w-full">
          <img
            src={getAvatarUrl(avatar)}
            className="w-full object-cover blur-lg pointer-events-none"
          />
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-2/3 justify-center items-center 
                w-1/2 min-w-16 aspect-square rounded-full overflow-hidden bg-cover bg-top"
            style={{ backgroundImage: `url('${getAvatarUrl(avatar)}')` }}
          />
        </div>
      )}
      <div
        className={cn(
          'absolute -top-1 -right-1 size-8 m-1 p-1',
          'flex items-center justify-center rounded-full scale-75',
          'text-sm text-white font-bold font-mono border-2 border-slate-200/40',
          {
            'bg-gray-300 text-foreground': templeLevel <= 0,
            'bg-green-500': templeLevel === 1,
            'bg-purple-500': templeLevel === 2,
            'bg-amber-500': templeLevel === 3,
          }
        )}
      >
        {refine > 0 ? `+${refine}` : templeLevel}
      </div>
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-10',
          'bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white',
          {
            'h-full': showLine,
          }
        )}
        onClick={() => {
          if (isEmpty(line)) return;
          setShowLine(!showLine);
        }}
      >
        <div className="absolute bottom-0 w-full px-1 pt-4 pb-1.5">
          <div
            className={cn({
              hidden: showLine,
            })}
          >
            <div className="flex flex-row items-center">
              <div
                className="flex-1 text-xs font-normal truncate"
                title={`${formatCurrency(assets)} / ${formatCurrency(
                  sacrifices
                )}`}
              >
                <span className="mr-0.5">{formatCurrency(assets)}</span>/
                <span className="ml-0.5">{formatCurrency(sacrifices)}</span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-1 h-2">
              <Progress
                value={(assets / sacrifices) * 100}
                rootColor="bg-white/20"
                indicatorColor={cn({
                  'bg-gray-300': templeLevel <= 0,
                  'bg-green-500 dark:bg-green-600': templeLevel === 1,
                  'bg-purple-500 dark:bg-purple-600': templeLevel === 2,
                  'bg-amber-500 dark:bg-amber-600': templeLevel === 3,
                })}
                className="h-1"
              />
              {starForces >= 10000 && (
                <div
                  className="w-fit text-amber-300 dark:text-amber-500"
                  title="已冲星"
                >
                  <AiFillStar className="size-3" />
                </div>
              )}
            </div>
          </div>
          <div
            className={cn('flex flex-col mb-0.5', {
              hidden: !showLine,
            })}
          >
            <div className="flex-1 text-xs font-normal whitespace-pre-wrap">
              {line}
            </div>
          </div>
        </div>
      </div>
    </AspectRatio>
  );
}
