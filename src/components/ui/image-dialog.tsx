import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowDownUp, ArrowLeftRight, CornerUpLeft, CornerUpRight, X, ZoomIn, ZoomOut } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ImageDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
  src: string
}
function ImageDialog({
  src,
  ...props
}: ImageDialogProps) {
  const [scale, setScale] = React.useState(1);
  const [flipX, setFlipX] = React.useState(1);
  const [flipY, setFlipY] = React.useState(1);
  const [rotate, setRotate] = React.useState(0);

  React.useEffect(() => {
    if (!props.open) {
      setScale(1);
      setFlipX(1);
      setFlipY(1);
      setRotate(0);
    }
  }, [props.open]);

  return (
    <DialogPrimitive.Root data-slot="dialog" {...props}>
      <ImageDialogContent
        src={src}
        scale={scale}
        flipX={flipX}
        flipY={flipY}
        rotate={rotate}
        setScale={setScale}
        setFlipX={setFlipX}
        setFlipY={setFlipY}
        setRotate={setRotate}
      />
    </DialogPrimitive.Root>
  );
}

function ImageDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function ImageDialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function ImageDialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function ImageDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
        fixed inset-0 z-50 bg-black/50`,
        className
      )}
      {...props}
    />
  )
}

interface ImageDialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  src: string
  scale: number
  flipX: number
  flipY: number
  rotate: number
  setScale: React.Dispatch<React.SetStateAction<number>>
  setFlipX: React.Dispatch<React.SetStateAction<number>>
  setFlipY: React.Dispatch<React.SetStateAction<number>>
  setRotate: React.Dispatch<React.SetStateAction<number>>
}

function ImageDialogContent({
  className,
  children,
  src,
  ...props
}: ImageDialogContentProps) {

  const {
    scale,
    flipX,
    flipY,
    rotate,
    setScale,
    setFlipX,
    setFlipY,
    setRotate,
  } = props;

  const handleRotateClockwise = () => setRotate(prev => prev + 90);
  const handleRotateCounterClockwise = () => setRotate(prev => prev - 90);

  const handleFlipX = () => setFlipX(prev => prev * -1);
  const handleFlipY = () => setFlipY(prev => prev * -1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(1, prev - 0.2));
  };

  const ContentAction = () => {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-60 pointer-events-auto">
        <div className="flex px-6 gap-2 rounded-full text-white/65 bg-black/10 backdrop-blur-sm select-none">
          <div
            className="p-3 opacity-70 hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleFlipY();
            }}
          >
            <ArrowDownUp className="size-5" />
          </div>
          <div
            className="p-3 opacity-70 hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleFlipX();
            }}
          >
            <ArrowLeftRight className="size-5" />
          </div>
          <div
            className="p-3 opacity-70 hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleRotateCounterClockwise();
            }}
          >
            <CornerUpLeft className="size-5" />
          </div>
          <div
            className="p-3 opacity-70 hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleRotateClockwise();
            }}
          >
            <CornerUpRight className="size-5" />
          </div>
          <div
            className={cn(
              "p-3 opacity-70 hover:opacity-100 cursor-pointer",
              scale <= 1 && "opacity-50 hover:opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => {
              e.preventDefault();
              handleZoomOut();
            }}
          >
            <ZoomOut className="size-5" />
          </div>
          <div
            className={cn(
              "p-3 opacity-70 hover:opacity-100 cursor-pointer",
              scale >= 3 && "opacity-50 hover:opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => {
              e.preventDefault();
              handleZoomIn();
            }}
          >
            <ZoomIn className="size-5" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ImageDialogPortal data-slot="dialog-portal">
      <ImageDialogClose asChild>
        <ImageDialogOverlay />
      </ImageDialogClose>
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          `bg-transparent data-[state=open]:animate-in data-[state=closed]:animate-out 
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
          fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] 
          gap-4 rounded-lg border-none p-0 duration-200 sm:max-w-lg`,
          className
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onWheel={(e) => {
          if (e.deltaY > 0 && scale > 1) handleZoomOut();
          if (e.deltaY < 0 && scale < 3) handleZoomIn();
        }}
        {...props}
      >
        <VisuallyHidden asChild>
          <ImageDialogTitle />
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <ImageDialogDescription />
        </VisuallyHidden>
        <img
          className="w-full h-auto rounded-lg transition-transform duration-200"
          src={src}
          draggable="false"
          style={{
            transform: `
            scale(${scale}) 
            scaleX(${flipX}) 
            scaleY(${flipY}) 
            rotate(${rotate}deg)
          `,
          }}
        />
      </DialogPrimitive.Content>
      <ContentAction />
      <DialogPrimitive.Close>
        <div className="fixed top-8 right-8 z-60 pointer-events-auto">
          <div className="flex rounded-full text-white/65 bg-black/10 backdrop-blur-sm select-none">
            <div className="p-3 opacity-70 hover:opacity-100 cursor-pointer">
              <X className="size-5" />
            </div>
          </div>
        </div>
      </DialogPrimitive.Close>
    </ImageDialogPortal>
  )
}

function ImageDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function ImageDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function ImageDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function ImageDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  ImageDialog,
  ImageDialogClose,
  ImageDialogContent,
  ImageDialogDescription,
  ImageDialogFooter,
  ImageDialogHeader,
  ImageDialogOverlay,
  ImageDialogPortal,
  ImageDialogTitle,
  ImageDialogTrigger
};

