import { TempleItem } from '@/api/character';
import { cn, getAvatarUrl, getCoverUrl } from '@/lib/utils';
import { useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

/**
 * LINK
 * @param props
 * @param {TempleItem} props.link1
 * @param {TempleItem} props.link2
 */
export function Link({
  link1,
  link2,
}: {
  link1: TempleItem;
  link2: TempleItem;
}) {
  let leftLink = link1;
  let rightLink = link2;

  useEffect(() => {
    if (link1.Sacrifices < link2.Sacrifices) {
      leftLink = link2;
      rightLink = link1;
    }

    if (link1.Sacrifices === link2.Sacrifices) {
      if (
        !isNaN(new Date(link1.Create).getTime()) &&
        !isNaN(new Date(link2.Create).getTime()) &&
        new Date(link1.Create).getTime() < new Date(link2.Create).getTime()
      ) {
        leftLink = link2;
        rightLink = link1;
      }
    }
  }, [link1, link2]);

  return (
    <div className="relative flex flex-row items-center w-[214px] h-full mt-3 shadow-card">
      <div className="absolute w-[120px] h-[165px] mr-[10px] -skew-x-10 origin-top-left overflow-hidden">
        <PhotoProvider
          bannerVisible={false}
          maskOpacity={0.4}
          className="pointer-events-auto backdrop-blur-xs"
        >
          <PhotoView src={getCoverUrl(leftLink.Cover || '', 'large')}>
            <div
              className={cn(
                'relative w-[118px] h-[160px] box-content border-2 border-r-0 rounded-l-md',
                'bg-cover bg-center bg-no-repeat',
                'skew-x-10 origin-top-left overflow-hidden cursor-pointer',
                {
                  'border-gray-400': leftLink.Level === 0,
                  'border-green-500': leftLink.Level === 1,
                  'border-purple-500': leftLink.Level === 2,
                  'border-amber-500': leftLink.Level === 3,
                }
              )}
              style={{
                backgroundImage: `url(${getAvatarUrl(
                  leftLink.Cover,
                  'medium'
                )})`,
              }}
            />
          </PhotoView>
        </PhotoProvider>
      </div>
      <div className="absolute flex left-[93px] w-[120px] h-[165px] mr-[10px] -skew-x-10 origin-bottom-right overflow-hidden">
        <PhotoProvider
          bannerVisible={false}
          maskOpacity={0.4}
          className="pointer-events-auto backdrop-blur-xs"
        >
          <PhotoView src={getCoverUrl(rightLink.Cover || '', 'large')}>
            <div
              className={cn(
                'relative w-[118px] h-[160px] box-content border-2 border-l-0 rounded-r-md',
                'bg-cover bg-center bg-no-repeat',
                'skew-x-10 origin-bottom-right overflow-hidden cursor-pointer',
                {
                  'border-gray-400': rightLink.Level === 0,
                  'border-green-500': rightLink.Level === 1,
                  'border-purple-500': rightLink.Level === 2,
                  'border-amber-500': rightLink.Level === 3,
                }
              )}
              style={{
                backgroundImage: `url(${getAvatarUrl(
                  rightLink.Cover || '',
                  'medium'
                )})`,
              }}
            />
          </PhotoView>
        </PhotoProvider>
      </div>
    </div>
  );
}
