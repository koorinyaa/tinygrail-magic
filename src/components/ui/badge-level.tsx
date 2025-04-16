import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
interface BadgeLevelProps {
  level: number
  zeroCount?: number
}
export default function BadgeLevel({ level, zeroCount }: BadgeLevelProps) {
  return (
    <Badge
      variant="secondary"
      className={
        cn(
          "bg-yellow-500 dark:bg-yellow-600 text-white font-bold font-mono px-1 py-0 rounded-sm scale-75",
          {
            "bg-slate-400 dark:bg-slate-600": level === 0,
            "bg-lime-500 dark:bg-lime-600": level === 1,
            "bg-green-500 dark:bg-green-600": level === 2,
            "bg-emerald-500 dark:bg-emerald-600": level === 3,
            "bg-teal-500 dark:bg-teal-600": level === 4,
            "bg-cyan-500 dark:bg-cyan-600": level === 5,
            "bg-sky-500 dark:bg-sky-600": level === 6,
            "bg-blue-500 dark:bg-blue-600": level === 7,
            "bg-indigo-500 dark:bg-indigo-600": level === 8,
            "bg-violet-500 dark:bg-violet-600": level === 9,
            "bg-purple-500 dark:bg-purple-600": level === 10,
            "bg-fuchsia-500 dark:bg-fuchsia-600": level === 11,
            "bg-pink-500 dark:bg-pink-600": level === 12,
            "bg-rose-500 dark:bg-rose-600": level === 13,
            "bg-orange-500 dark:bg-orange-600": level === 14,
            "bg-amber-500 dark:bg-amber-600": level === 15,
          },
        )
      }
      title="等级"
    >
      {level <= 0 && zeroCount && zeroCount > 0 ? `ST${zeroCount}` : `Lv${level}`}
    </Badge>
  )
}