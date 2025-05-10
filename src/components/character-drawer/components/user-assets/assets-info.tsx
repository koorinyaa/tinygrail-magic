import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatInteger } from '@/lib/utils';
import { useStore } from '@/store';

/**
 * 资产信息
 */
export function AssetsInfo() {
  const { characterDrawer, characterDrawerData } = useStore();
  const {
    characterDetailData = null,
    userCharacterData = null,
    userTempleData = null,
  } = characterDrawerData;

  const {
    Rank: rank = 0,
    Rate: rate = 0,
    Level: characterLevel = 0,
    Stars: stars = 0,
  } = characterDetailData || {};

  const {
    Assets: assets = 0,
    Refine: refine = 0,
    Level: templeLevel = 0,
    StarForces: starForces = 0,
  } = userTempleData || {};

  const { Total: total = 0, Amount: amount = 0 } = userCharacterData || {};

  /**
   * 获取圣殿股息
   */
  const getTempleRate = () => {
    if (rank <= 500) {
      const baseRate = rate * (601 - rank) * 0.005;
      const levelCoefficient = 2 * characterLevel + 1;
      const refineCoefficient = 2 * (characterLevel + refine) + 1;
      const templeRate = (baseRate / levelCoefficient) * refineCoefficient;
      return templeRate;
    } else {
      return stars * 2;
    }
  };

  const assetItems = [
    { label: '持股', value: formatInteger(total, true) },
    { label: '可用活股', value: formatInteger(amount, true) },
    { label: '圣殿等级', value: refine > 0 ? `+${refine}` : templeLevel },
    { label: '圣殿股息₵', value: formatCurrency(getTempleRate()) },
    {
      label: '圣殿总息₵',
      value: formatCurrency(getTempleRate() * assets, { useWUnit: true }),
    },
    { label: '星之力', value: formatInteger(starForces, true) },
  ];

  if (characterDrawer.loading) {
    return (
      <div className="w-full flex-1 ml-2">
        <div className="flex flex-col w-full h-full">
          {Array(6).fill(null).map((_, index) => (
            <Skeleton
              key={index}
              className="flex-1 w-full h-full m-1 first:mt-0 last:mb-0 bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 ml-2 bg-slate-100/80 dark:bg-slate-800/60 rounded-sm">
      <div className="flex flex-col h-full text-xs divide-y divide-slate-300/30 dark:divide-slate-800/70 p-2 first:pt-0 last:pb-0">
        {assetItems.map(({ label, value }, index) => (
          <div key={index} className="flex-1 flex items-center">
            <span className="truncate">{label}</span>
            <span className="flex-1 font-semibold text-right truncate">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
