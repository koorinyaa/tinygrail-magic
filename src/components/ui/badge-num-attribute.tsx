import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const BadgeNumAttributeVariants = cva(
  "inline-flex items-center bg-background text-xs text-muted-foreground border",
  {
    variants: {
      variant: {
        default: "rounded-[0.375rem] gap-x-1.5 py-0.5 px-2",
        pill: "rounded-full gap-x-1.5 py-0.5 px-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface FilterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof BadgeNumAttributeVariants> {
  label?: string
  value?: string
  children?: React.ReactNode
}

export function BadgeNumAttribute({
  className,
  variant,
  label,
  value,
  children,
  ...props
}: FilterBadgeProps) {
  return (
    <span className={cn(BadgeNumAttributeVariants({ variant }), className)} {...props}>
      {label}
      <span className="h-3 w-px bg-border" />
      <span className="font-medium text-foreground">
        {value}
      </span>
    </span>
  )
}