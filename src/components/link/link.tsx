import { TempleItem } from '@/api/character';
import { cn, getAvatarUrl, getCoverUrl } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

/**
 * LINK
 * @param props
 * @param {TempleItem} props.link1 - link1数据
 * @param {TempleItem} props.link2 - link2数据
 * @param {boolean} props.[jumpable] - 是否可跳转
 */
export function Link({
  link1,
  link2,
  jumpable = false,
}: {
  link1: TempleItem;
  link2: TempleItem;
  jumpable?: boolean;
}) {
  const { openCharacterDrawer } = useStore();
  const [leftLink, setLeftLink] = useState<TempleItem>(link1);
  const [rightLink, setRightLink] = useState<TempleItem>(link2);

  useEffect(() => {
    if (leftLink.Sacrifices < rightLink.Sacrifices) {
      setLeftLink(rightLink);
      setRightLink(leftLink);
    }

    if (leftLink.Sacrifices === rightLink.Sacrifices) {
      if (
        !isNaN(new Date(leftLink.Create).getTime()) &&
        !isNaN(new Date(rightLink.Create).getTime()) &&
        new Date(leftLink.Create).getTime() <
          new Date(rightLink.Create).getTime()
      ) {
        setLeftLink(rightLink);
        setRightLink(leftLink);
      }
    }
  }, [link1, link2]);

  return (
    <div className="relative flex flex-row items-center w-[214px] h-[164px] shadow-card">
      <div className="absolute w-[120px] h-[165px] mr-[10px] -skew-x-10 origin-top-left overflow-hidden">
        {leftLink.Cover ? (
          <PhotoProvider
            bannerVisible={false}
            maskOpacity={0.4}
            className="pointer-events-auto backdrop-blur-xs"
          >
            <PhotoView src={getCoverUrl(leftLink.Cover, 'large')}>
              <div
                className={cn(
                  'relative w-[118px] h-[160px] box-content border-2 border-r-0 rounded-l-md',
                  'bg-cover bg-top bg-no-repeat',
                  'skew-x-10 origin-top-left overflow-hidden cursor-pointer',
                  {
                    'border-gray-400': leftLink.Level === 0,
                    'border-green-500': leftLink.Level === 1,
                    'border-purple-500': leftLink.Level === 2,
                    'border-amber-500': leftLink.Level === 3,
                  }
                )}
                style={{
                  backgroundImage: `url(${getCoverUrl(
                    leftLink.Cover,
                    'medium'
                  )})`,
                }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white"
                  onClick={(e) => {
                    if (jumpable) {
                      e.stopPropagation();
                      openCharacterDrawer(leftLink.CharacterId);
                    }
                  }}
                >
                  <div className="absolute bottom-0 w-full px-2 pt-4 pb-1.5">
                    <div className="text-xs w-20 truncate">
                      {leftLink.CharacterName}
                    </div>
                  </div>
                </div>
              </div>
            </PhotoView>
          </PhotoProvider>
        ) : (
          <div
            className={cn(
              'relative w-[118px] h-[160px] box-content border-2 border-r-0 rounded-l-md',
              'bg-cover bg-top bg-no-repeat',
              'skew-x-10 origin-top-left overflow-hidden cursor-pointer',
              {
                'border-gray-400': leftLink.Level === 0,
                'border-green-500': leftLink.Level === 1,
                'border-purple-500': leftLink.Level === 2,
                'border-amber-500': leftLink.Level === 3,
              }
            )}
            style={{
              backgroundImage: `url(${getAvatarUrl('', 'medium')})`,
            }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white"
              onClick={(e) => {
                if (jumpable) {
                  e.stopPropagation();
                  openCharacterDrawer(leftLink.CharacterId);
                }
              }}
            >
              <div className="absolute bottom-0 w-full px-2 pt-4 pb-1.5">
                <div className="text-xs w-20 truncate">
                  {leftLink.CharacterName}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute flex left-[93px] w-[120px] h-[165px] mr-[10px] -skew-x-10 origin-bottom-right overflow-hidden">
        {rightLink.Cover ? (
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
                  backgroundImage: `url(${getCoverUrl(
                    rightLink.Cover,
                    'medium'
                  )})`,
                }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white"
                  onClick={(e) => {
                    if (jumpable) {
                      e.stopPropagation();
                      openCharacterDrawer(rightLink.CharacterId);
                    }
                  }}
                >
                  <div className="absolute bottom-0 w-full px-2 pt-4 pb-1.5">
                    <div className="text-xs text-right w-25 truncate">
                      {rightLink.CharacterName}
                    </div>
                  </div>
                </div>
              </div>
            </PhotoView>
          </PhotoProvider>
        ) : (
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
              backgroundImage: `url(${getAvatarUrl('', 'medium')})`,
            }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white"
              onClick={(e) => {
                if (jumpable) {
                  e.stopPropagation();
                  openCharacterDrawer(rightLink.CharacterId);
                }
              }}
            >
              <div className="absolute bottom-0 w-full px-2 pt-4 pb-1.5">
                <div className="text-xs text-right w-25 truncate">
                  {rightLink.CharacterName}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
