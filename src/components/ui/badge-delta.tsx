import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  RiArrowDownLine,
  RiArrowDownSFill,
  RiArrowRightLine,
  RiArrowRightSFill,
  RiArrowUpLine,
  RiArrowUpSFill,
} from "@remixicon/react"

const badgeDeltaVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        outline:
          "gap-x-1 ring-1 ring-inset ring-border",
        solid: "gap-x-1",
        solidOutline:
          "gap-x-1 ring-1 ring-inset",
      },
      deltaType: {
        increase: "",
        decrease: "",
        neutral: "",
      },
      iconStyle: {
        filled: "",
        line: "",
      },
    },
    compoundVariants: [
      {
        deltaType: "increase",
        variant: "outline",
        className: "text-emerald-700 dark:text-emerald-500",
      },
      {
        deltaType: "decrease",
        variant: "outline",
        className: "text-red-700 dark:text-red-500",
      },
      {
        deltaType: "neutral",
        variant: "outline",
        className: "text-gray-700 dark:text-gray-400",
      },
      // Solid variants
      {
        deltaType: "increase",
        variant: "solid",
        className:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-500",
      },
      {
        deltaType: "decrease",
        variant: "solid",
        className:
          "bg-red-100 text-red-800 dark:bg-red-400/20 dark:text-red-500",
      },
      {
        deltaType: "neutral",
        variant: "solid",
        className:
          "bg-gray-200/50 text-gray-700 dark:bg-gray-500/30 dark:text-gray-300",
      },
      // Solid outline variants
      {
        deltaType: "increase",
        variant: "solidOutline",
        className:
          "bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/20 dark:text-emerald-500 dark:ring-emerald-400/20",
      },
      {
        deltaType: "decrease",
        variant: "solidOutline",
        className:
          "bg-red-100 text-red-800 ring-red-600/10 dark:bg-red-400/20 dark:text-red-500 dark:ring-red-400/20",
      },
      {
        deltaType: "neutral",
        variant: "solidOutline",
        className:
          "bg-gray-100 text-gray-700 ring-gray-600/10 dark:bg-gray-500/30 dark:text-gray-300 dark:ring-gray-400/20",
      },
    ],
  },
)

interface BadgeDeltaProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeDeltaVariants> {
  size?: 'sm' | 'md'
  value: string | number
}

const DeltaIcon = ({
  deltaType,
  iconStyle,
  className = "",
}: {
  deltaType: "increase" | "decrease" | "neutral"
  iconStyle: "filled" | "line"
  className?: string
}) => {
  const icons = {
    increase: {
      filled: RiArrowUpSFill,
      line: RiArrowUpLine,
    },
    decrease: {
      filled: RiArrowDownSFill,
      line: RiArrowDownLine,
    },
    neutral: {
      filled: RiArrowRightSFill,
      line: RiArrowRightLine,
    },
  }

  const Icon = icons[deltaType][iconStyle]
  return <Icon className={cn("-ml-0.5", className)} aria-hidden={true} />
}

export function BadgeDelta({
  className,
  variant = "outline",
  deltaType = "neutral",
  iconStyle = "filled",
  size = 'md',
  value,
  ...props
}: BadgeDeltaProps) {
  return (
    <span
      className={cn(
        badgeDeltaVariants({ variant, deltaType, className }),
        {
          "font-medium text-xs px-2 py-0.5 rounded-sm": size === 'sm',
          "font-semibold text-sm px-2 py-1 rounded-[0.375rem]": size === 'md',
        },
      )}
      {...props}
    >
      <DeltaIcon
        deltaType={deltaType || "neutral"}
        iconStyle={iconStyle || "filled"}
        className={cn(
          {
            'size-3': size === 'sm',
            'size-4': size === 'md',
          }
        )}
      />
      {value}
    </span>
  )
}
