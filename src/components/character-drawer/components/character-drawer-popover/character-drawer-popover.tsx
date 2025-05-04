import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * 角色抽屉弹出层
 * @param {CharacterDrawerPopoverProps} props 属性
 * @param {boolean} props.open 是否打开
 * @param {function} props.onOpenChange 打开状态改变回调
 * @param {ReactNode} props.children 子元素
 * @param {string} props.className 类名
 */
export function CharacterDrawerPopover({
  open,
  onOpenChange,
  children,
  className = '',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={() => onOpenChange(false)}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[calc(100%-1rem)] max-h-[90%] p-4 w-full h-auto",
          "bg-popover rounded-sm m-shadow-card overflow-auto z-50",
          className
        )}
      >
        {children}
      </motion.div>
    </>
  )
}
