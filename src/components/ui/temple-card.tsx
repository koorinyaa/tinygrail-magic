import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { AiFillStar } from "react-icons/ai";

interface TempleCardProps {
  cover: string;
  assets: number;
  sacrifices: number;
  starForces: number;
  templeLevel: number;
  refine: number;
  className?: string;
}
/**
 * 圣殿卡片
 * @param { TempleCardProps } porps
 * @param {string} porps.cover - 封面图片 URL
 * @param {number} porps.assets - 固定资产余量
 * @param {number} porps.sacrifices - 固定资产上限
 * @param {number} porps.starForces - 贡献星之力
 * @param {number} porps.templeLevel - 圣殿等级
 * @param {number} porps.refine - 精炼等级
 * @param {string} porps.className - 自定义类名
 */
export function TempleCard({ cover, assets, sacrifices, starForces, templeLevel, refine, className }: TempleCardProps) {
  const [isCoverLoaded, setIsCoverLoaded] = useState(false);

  return (
    <AspectRatio
      ratio={3 / 4}
      className={cn("relative border border-slate-200/50 dark:border-slate-700/50", className)}
    >
      <img
        src={cover}
        alt="圣殿"
        className={cn(
          "w-full h-full object-cover object-top",
          !isCoverLoaded && "hidden"
        )}
        onLoad={() => setIsCoverLoaded(true)}
      />
      {
        !isCoverLoaded && <Skeleton className="w-full h-full rounded-sm bg-slate-200 dark:bg-slate-900" />
      }
      <div
        className={cn(
          "absolute top-0 right-0 size-8 m-1 p-1",
          "flex items-center justify-center scale-80",
          "rounded-full border-2",
          "text-sm font-semibold font-mono",
          "bg-gray-800/50",
          {
            "border-gray-300 text-gray-300": templeLevel <= 0,
            "border-green-300 text-green-300": templeLevel === 1,
            "border-cyan-300 text-cyan-300": templeLevel === 2,
            "border-amber-300 text-amber-300": templeLevel === 3,
          }
        )}
      >
        {refine > 0 ? `+${refine}` : templeLevel}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white">
        <div className="absolute bottom-0 w-full px-2 pt-4 pb-1.5">
          <div className="flex flex-row items-center mb-0.5">
            <div className="flex-1 text-xs font-normal truncate">
              {formatCurrency(assets)} / {formatCurrency(sacrifices)}
            </div>
            {
              starForces > 10000 &&
              <div className="w-fit text-amber-300 dark:text-amber-500">
                <AiFillStar className="size-3" />
              </div>
            }
          </div>
          <Progress
            value={assets / sacrifices * 100}
            rootColor="bg-white/20"
            indicatorColor={cn({
              "bg-gray-300": templeLevel <= 0,
              "bg-green-300": templeLevel === 1,
              "bg-cyan-300": templeLevel === 2,
              "bg-amber-300": templeLevel === 3,
            })}
            className="h-1"
          />
        </div>
      </div>
    </AspectRatio>
  )
}
