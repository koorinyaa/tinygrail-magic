import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency, getCoverUrl } from "@/lib/utils";
import { AiFillStar } from "react-icons/ai";
import { PhotoProvider, PhotoView } from "react-photo-view";

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

  return (
    <AspectRatio
      ratio={3 / 4}
      className={cn("relative border border-slate-200/50 dark:border-slate-700/50", className)}
    >
      <PhotoProvider bannerVisible={false} maskOpacity={0.4} className="pointer-events-auto backdrop-blur-xs">
        <PhotoView src={getCoverUrl(cover, "large")}>
          <img
            src={getCoverUrl(cover, "medium")}
            alt="圣殿"
            draggable="false"
            className="w-full h-full object-cover object-top cursor-pointer"
          />
        </PhotoView>
      </PhotoProvider>
      <div
        className={cn(
          "absolute top-0 right-0 size-8 m-1 p-1",
          "flex items-center justify-center rounded-full scale-80",
          "text-sm font-bold font-mono border-2 border-slate-200/40",
          "bg-slate-400/20 backdrop-blur-lg",
          {
            "text-gray-400": templeLevel <= 0,
            "text-green-500 dark:text-green-600": templeLevel === 1,
            "text-purple-500 dark:text-purple-600": templeLevel === 2,
            "text-amber-500 dark:text-amber-600": templeLevel === 3,
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
              starForces >= 10000 &&
              <div className="w-fit text-amber-300 dark:text-amber-500">
                <AiFillStar className="size-3" />
              </div>
            }
          </div>
          <Progress
            value={(assets / sacrifices) * 100}
            rootColor="bg-white/20"
            indicatorColor={cn({
              "bg-gray-300": templeLevel <= 0,
              "bg-green-500 dark:bg-green-600": templeLevel === 1,
              "bg-purple-500 dark:bg-purple-600": templeLevel === 2,
              "bg-amber-500 dark:bg-amber-600": templeLevel === 3,
            })}
            className="h-1"
          />
        </div>
      </div>
    </AspectRatio>
  )
}
