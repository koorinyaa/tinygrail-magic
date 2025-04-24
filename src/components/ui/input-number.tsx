import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentProps, useState, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

export function InputNumber({
  className,
  value,
  min,
  max,
  disabled,
  onChange,
  mode = "integer",
  ...props
}: ComponentProps<"input"> & {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  mode?: "integer" | "decimal";
}) {
  const [inputValue, setInputValue] = useState(String(value));

  // 当外部value变化时，更新inputValue
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  // 处理浮点数精度问题
  const roundToDecimalPlaces = (num: number, decimalPlaces = 10): number => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
  };

  const handleChange = (newValue: string) => {
    // 根据模式选择不同的验证正则表达式
    const validInputRegex = mode === "integer" 
      ? /^-?\d*$/ // 整数模式：只允许数字和可能的负号
      : /^-?\d*\.?\d*$/; // 小数模式：允许数字、小数点和可能的负号
    
    if (!validInputRegex.test(newValue) && newValue !== "" && newValue !== "-") {
      // 如果输入不符合要求，保持原值不变
      return;
    }
    
    // 更新输入框显示值
    setInputValue(newValue);
    
    // 处理空输入，设置默认值为0
    if (newValue === "") {
      // 验证最小值
      let defaultValue = 0;
      if (min !== undefined && defaultValue < min) {
        defaultValue = min;
      }
      onChange?.(defaultValue);
      return;
    }
    
    // 特殊处理：根据模式处理特殊输入
    if ((mode === "decimal" && newValue === ".") || 
        (newValue === "-" && (min === undefined || min < 0)) || 
        (mode === "decimal" && newValue === "-." && (min === undefined || min < 0)) || 
        (mode === "decimal" && newValue.endsWith(".") && !isNaN(Number(newValue.slice(0, -1))))) {
      // 如果min>=0但用户尝试输入负号，则不更新输入框
      if (newValue.startsWith("-") && min !== undefined && min >= 0) {
        setInputValue(String(value)); // 恢复原值
      }
      return;
    }
    
    let validatedValue = Number(newValue);
    
    // 如果不是有效数字，直接返回
    if (isNaN(validatedValue)) {
      return;
    }

    // 整数模式下，确保值为整数
    if (mode === "integer") {
      validatedValue = Math.round(validatedValue);
    }

    // 验证最小值
    if (min !== undefined) {
      if (validatedValue < min) {
        validatedValue = min;
        // 更新输入框显示为最小值
        setInputValue(String(min));
      }
    }

    // 验证最大值
    if (max !== undefined) {
      if (validatedValue > max) {
        validatedValue = max;
        // 更新输入框显示为最大值
        setInputValue(String(max));
      }
    }

    // 处理精度问题（小数模式下）
    if (mode === "decimal") {
      validatedValue = roundToDecimalPlaces(validatedValue);
    }

    onChange?.(validatedValue);
  };

  // 处理加减按钮的点击
  const handleButtonClick = (increment: number) => {
    if (disabled) return;

    let newValue;

    if (mode === "integer") {
      // 整数模式：直接加减整数
      newValue = Math.round(value) + increment;
    } else {
      // 小数模式：保持小数精度
      // 获取当前值的小数位数
      const currentValueStr = String(value);
      const decimalPlaces = currentValueStr.includes('.')
        ? currentValueStr.split('.')[1].length
        : 0;

      // 根据当前值的小数位数来计算新值，保持相同的精度
      const factor = Math.pow(10, decimalPlaces);
      newValue = roundToDecimalPlaces(
        (Math.round(value * factor) + Math.round(increment * factor)) / factor
      );
    }

    let validatedValue = newValue;

    // 验证最小值
    if (min !== undefined) {
      validatedValue = Math.max(min, validatedValue);
    }

    // 验证最大值
    if (max !== undefined) {
      validatedValue = Math.min(max, validatedValue);
    }

    // 直接更新输入值和显示值
    setInputValue(String(validatedValue));
    onChange?.(validatedValue);
  };

  return (
    <div className={cn(
      "flex flex-row items-center rounded-md shadow-xs transition-all",
      "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
      className
    )}>
      <Input
        type="text"
        inputMode={mode === "integer" ? "numeric" : "decimal"}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "h-8 border-r-0 rounded-r-none shadow-none focus-visible:ring-0",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        disabled={disabled}
        {...props}
      />
      <div className="flex flex-row">
        <div
          className={cn(
            "flex items-center justify-center size-8 border-t border-b cursor-pointer",
            "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600",
            {
              "bg-slate-100 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-not-allowed": disabled || (min !== undefined && value <= min),
            }
          )}
          onClick={() => handleButtonClick(-1)}
        >
          <span className="text-sm">
            <AiOutlineMinus />
          </span>
        </div>
        <div
          className={cn(
            "flex items-center justify-center size-8 border border-l-0 rounded-r-md cursor-pointer",
            "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600",
            {
              "bg-slate-100 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-not-allowed": disabled || (max !== undefined && value >= max),
            }
          )}
          onClick={() => handleButtonClick(1)}
        >
          <span className="text-sm">
            <AiOutlinePlus />
          </span>
        </div>
      </div>
    </div>
  )
}