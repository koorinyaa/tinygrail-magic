import { CurrentTopWeekItem } from '@/api/character';
import { cn, formatCurrency, formatInteger } from '@/lib/utils';

interface DetailInfoProps {
  data: CurrentTopWeekItem;
  scoreMultiplier: number;
  className?: string;
}
/**
 * 详细信息区域组件
 * @param props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {number} props.scoreMultiplier - 评分倍率
 * @param {string} props.className - 自定义类名
 */
export function DetailInfo({
  data,
  scoreMultiplier,
  className,
}: {
  data: CurrentTopWeekItem;
  scoreMultiplier: number;
  className?: string;
}) {
  const {
    Type: userCount,
    Assets: auctionCount,
    Extra: extra,
    Price: price,
    Sacrifices: valhalla,
  } = data;

  const score = (extra + userCount * scoreMultiplier) / 100;
  const infoData = [
    { id: 'userCount', label: '人数', value: formatInteger(userCount) },
    {
      id: 'avgPrice',
      label: '均价₵',
      value: formatCurrency((extra + price * valhalla) / auctionCount),
    },
    { id: 'auctionCount', label: '拍卖数', value: formatInteger(auctionCount) },
    { id: 'valhalla', label: '英灵殿', value: formatInteger(valhalla) },
    {
      id: 'score',
      label: '评分',
      value: formatCurrency(score, { maximumFractionDigits: 0 }),
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-end h-full w-full p-3 backdrop-blur-xs',
        'bg-gray-500/40 text-white rounded-lg z-10',
        className
      )}
    >
      {infoData.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 w-full text-sm text-white/90"
        >
          <span className="text-left min-w-6">{item.label}</span>
          <span className="flex-1 text-right font-bold truncate">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
