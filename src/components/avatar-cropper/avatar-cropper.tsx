import {
  CircleStencil,
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface AvatarCropperProps {
  src: string | null | undefined;
  cropperRef?: React.RefObject<FixedCropperRef>;
}
/**
 * 裁剪头像组件
 * @param src 图片地址
 * @param cropperRef 裁剪器ref
 */
export function AvatarCropper({ src, cropperRef }: AvatarCropperProps) {
  return (
    <FixedCropper
      ref={cropperRef}
      src={src}
      stencilSize={{
        width: 256,
        height: 256,
      }}
      stencilProps={{
        handlers: false,
        lines: true,
        movable: false,
        resizable: false,
      }}
      stencilComponent={CircleStencil}
      imageRestriction={ImageRestriction.stencil}
      className="w-full aspect-[3/4] !bg-transparent"
    />
  );
}
