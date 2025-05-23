import { TempleItem } from '@/api/character';
import { cn, decodeHTMLEntities, getAvatarUrl, getCoverUrl } from '@/lib/utils';
import { useStore } from '@/store';
import { Ban } from 'lucide-react';
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
  link1: TempleItem | null;
  link2: TempleItem | null;
  jumpable?: boolean;
}) {
  const { openCharacterDrawer } = useStore();
  const [leftLink, setLeftLink] = useState<TempleItem | null>(link1);
  const [rightLink, setRightLink] = useState<TempleItem | null>(link2);

  useEffect(() => {
    if (!rightLink) return;

    if (!leftLink) {
      const temp = leftLink;
      setLeftLink(rightLink);
      setRightLink(temp);
      return;
    }

    if (leftLink.Sacrifices < rightLink.Sacrifices) {
      const temp = leftLink;
      setLeftLink(rightLink);
      setRightLink(temp);
      return;
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

  const LeftLinkCard = () => {
    if (!leftLink)
      return (
        <div className="absolute w-[105px] h-[150px] -skew-x-10 origin-top-left overflow-hidden">
          <div
            className={cn(
              'relative w-[105px] h-[140px] box-content border-2 border-r-0 rounded-l-md',
              'bg-slate-200 dark:bg-slate-800 border-gray-400',
              'skew-x-10 origin-top-left overflow-hidden'
            )}
          >
            <div className="flex flex-row gap-1 items-center justify-center pr-3 h-full opacity-30">
              <Ban className="size-5" />
              <span className="text-lg">void</span>
            </div>
          </div>
        </div>
      );

    return (
      <div className="absolute w-[105px] h-[150px] -skew-x-10 origin-top-left overflow-hidden">
        {leftLink.Cover ? (
          <PhotoProvider
            bannerVisible={false}
            maskOpacity={0.4}
            className="pointer-events-auto backdrop-blur-xs"
          >
            <PhotoView src={getCoverUrl(leftLink.Cover, 'large')}>
              <div
                className={cn(
                  'relative w-[105px] h-[140px] box-content border-2 border-r-0 rounded-l-md',
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
                    <div className="text-xs w-17.5 truncate">
                      {decodeHTMLEntities(leftLink.CharacterName)}
                    </div>
                  </div>
                </div>
              </div>
            </PhotoView>
          </PhotoProvider>
        ) : (
          <div
            className={cn(
              'relative w-[105px] h-[140px] box-content border-2 border-r-0 rounded-l-md',
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
                <div className="text-xs w-17.5 truncate">
                  {decodeHTMLEntities(leftLink.CharacterName)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RightLinkCard = () => {
    if (!rightLink)
      return (
        <div className="absolute flex left-[80px] w-[120px] h-[150px] -skew-x-10 origin-bottom-right overflow-hidden">
          <div
            className={cn(
              'relative w-[105px] h-[140px] box-content border-2 border-l-0 rounded-r-md',
              'bg-slate-200 dark:bg-slate-800 border-gray-400',
              'skew-x-10 origin-bottom-right overflow-hidden'
            )}
          >
            <div className="flex flex-row gap-1 items-center justify-center pl-3 h-full opacity-30">
              <Ban className="size-5" />
              <span className="text-lg">void</span>
            </div>
          </div>
        </div>
      );

    return (
      <div className="absolute flex left-[80px] w-[120px] h-[150px] -skew-x-10 origin-bottom-right overflow-hidden">
        {rightLink.Cover ? (
          <PhotoProvider
            bannerVisible={false}
            maskOpacity={0.4}
            className="pointer-events-auto backdrop-blur-xs"
          >
            <PhotoView src={getCoverUrl(rightLink.Cover || '', 'large')}>
              <div
                className={cn(
                  'relative w-[105px] h-[140px] box-content border-2 border-l-0 rounded-r-md',
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
                    <div className="text-xs text-right w-22.5 truncate">
                      {decodeHTMLEntities(rightLink.CharacterName)}
                    </div>
                  </div>
                </div>
              </div>
            </PhotoView>
          </PhotoProvider>
        ) : (
          <div
            className={cn(
              'relative w-[105px] h-[140px] box-content border-2 border-l-0 rounded-r-md',
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
                <div className="text-xs text-right w-22.5 truncate">
                  {decodeHTMLEntities(rightLink.CharacterName)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-row items-center w-[188px] h-[150px] shadow-card">
      <LeftLinkCard />
      <RightLinkCard />
    </div>
  );
}
