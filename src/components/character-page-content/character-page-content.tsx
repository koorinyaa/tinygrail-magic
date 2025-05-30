import { RecentCharacterLog } from '@/components/recent-character-log';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GensokyoCharacters } from './components/gensokyo-characters';
import { RankCharacters } from './components/rank-characters';
import { STCharacters } from './components/st-characters';
import { TinygrailCharacters } from './components/tinygrail-characters';

/**
 * 角色内容区域
 * @param props
 */
export function CharacterPageContent() {
  const isMobile = useIsMobile(448);
  const showDrawer = useIsMobile(1280);
  const [selectedCategory, setSelectedCategory] = useState('tinygrail'); // 选中的分类
  // 抽屉是否打开
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!showDrawer) {
      setDrawerOpen(false);
    }
  }, [showDrawer]);

  // 分类选项数据
  const categories = [
    { value: 'tinygrail', label: '英灵殿' },
    { value: 'gensokyo', label: '幻想乡' },
    { value: 'st', label: 'ST' },
    { value: 'msrc', label: '最高股息' },
    { value: 'mvc', label: '最高市值' },
    { value: 'mrc', label: '最大涨幅' },
    { value: 'mfc', label: '最大跌幅' },
  ];

  const renderContent = () => {
    switch (selectedCategory) {
      case 'tinygrail':
        return <TinygrailCharacters />;
      case 'gensokyo':
        return <GensokyoCharacters />;
      case 'st':
        return <STCharacters />;
      case 'msrc':
        return <RankCharacters type="msrc" />;
      case 'mvc':
        return <RankCharacters type="mvc" />;
      case 'mrc':
        return <RankCharacters type="mrc" />;
      case 'mfc':
        return <RankCharacters type="mfc" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-0.5 mb-4">
        <div className="flex flex-wrap flex-row items-center justify-between">
          <h2 className="text-xl font-bold flex-1 w-22">角色</h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="hover:bg-accent cursor-pointer"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Badge
            variant="outline"
            className="flex xl:hidden rounded-full gap-x-0.5 pl-3 cursor-pointer"
            onClick={() => setDrawerOpen?.(true)}
          >
            最近活跃
            <ChevronRight />
          </Badge>
        </div>
      </div>
      <div>{renderContent()}</div>
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        direction={isMobile ? 'bottom' : 'right'}
        repositionInputs={false}
      >
        <DrawerContent
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          className={cn('bg-card border-none overflow-hidden', {
            'max-w-96 rounded-l-md': !isMobile,
            '!max-h-[90dvh] max-h-[90vh]': isMobile,
          })}
        >
          <VisuallyHidden asChild>
            <DrawerTitle />
          </VisuallyHidden>
          <RecentCharacterLog onCloseDrawer={() => setDrawerOpen(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
