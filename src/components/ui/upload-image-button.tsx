
import { Button } from "@/components/ui/button"
import { useFileUpload } from "@/hooks/use-file-upload"
import { cn } from "@/lib/utils"
import { ComponentProps, useEffect } from "react"

export interface UploadImageButtonProps {
  onImageChange?: (url: string | null, type: string) => void
  className?: string
  children?: React.ReactNode
}
/**
 *  上传图片按钮
 */
export function UploadImageButton({ 
  onImageChange, 
  className, 
  children, 
  ...props 
}: UploadImageButtonProps & ComponentProps<"button">) {
  const [{ files }, { openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    })

  useEffect(() => {
    if (files[0]) {
      onImageChange?.(files[0].preview || null, files[0].file.type)
    }
  }, [files])

  return (
    <>
      <Button onClick={openFileDialog} aria-haspopup="dialog" className={cn("inline-block", className)} {...props}>
        {children}
      </Button>
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
      />
    </>
  )
}
