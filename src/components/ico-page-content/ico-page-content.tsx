import { CharacterICOItem, getCharacterICO } from '@/api/character';
import { ICOCard } from '@/components/ico-page-content/components/ico-card';
import { RecentICOLog } from '@/components/recent-ico-log';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * ICO内容区域
 */
export function ICOPageContent() {
  const isMobile = useIsMobile(448);
  const showDrawer = useIsMobile(1280);
  const { toTop, characterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1);
  // 选中的分类
  const [selectedCategory, setSelectedCategory] = useState('mri');
  // 数据项
  const [icoItems, setIcoItems] = useState<CharacterICOItem[]>([]);
  // 分类选项数据
  const categories = [
    { value: 'mri', label: '即将结束' },
    { value: 'mvi', label: '最多资金' },
    { value: 'mui', label: '最多人数' },
  ];
  // 抽屉是否打开
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 记录上一次的值
  const prevStateRef = useRef({
    drawerOpen: characterDrawer.open,
  });

  // 监听页数和角色抽屉关闭变化
  useEffect(() => {
    const prevState = prevStateRef.current;
    // 抽屉状态从打开变为关闭
    if (prevState.drawerOpen && !characterDrawer.open) {
      fetchCharacterICOData(false);
    }

    // 更新抽屉状态引用
    prevState.drawerOpen = characterDrawer.open;
  }, [characterDrawer.open]);

  // 组件首次加载时获取数据
  useEffect(() => {
    fetchCharacterICOData();
  }, []);

  // 页数变化时回到顶部
  useEffect(() => {
    toTop();
  }, [currentPage]);

  // 分类变化时重置页数
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // 屏幕宽度变化时关闭抽屉
  useEffect(() => {
    if (!showDrawer) {
      setDrawerOpen(false);
    }
  }, [showDrawer]);

  /**
   * 获取ICO数据
   * @param {boolean} [updateLoading=true] - 是否更新loading状态
   */
  const fetchCharacterICOData = async (updateLoading: boolean = true) => {
    if (updateLoading) {
      setLoading(true);
    }

    try {
      const resp = await getCharacterICO('mri');
      if (resp.State === 0) {
        setIcoItems(resp.Value);
      } else {
        throw new Error(resp.Message || '获取ICO列表数据失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取ICO列表数据失败';
      notifyError(errorMessage);
    } finally {
      if (updateLoading) {
        setLoading(false);
      }
    }
  };

  /**
   * 根据当前分类和页码获取排序后的ICO列表
   * @returns {CharacterICOItem[]} 排序和分页后的ICO列表
   */
  const getSortedAndPaginatedItems = (): CharacterICOItem[] => {
    return icoItems
      .slice()
      .sort((a, b) => {
        switch (selectedCategory) {
          case 'mri':
            return new Date(a.End).getTime() - new Date(b.End).getTime();
          case 'mvi':
            return b.Total - a.Total;
          case 'mui':
            return b.Users - a.Users;
          default:
            return 0;
        }
      })
      .slice((currentPage - 1) * 24, currentPage * 24);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-0.5 mb-4">
        <div className="flex flex-wrap flex-row items-center justify-between">
          <h2 className="text-xl font-bold flex-1 w-22">ICO</h2>
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
      <div>
        <div className="flex flex-col">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(212px,1fr))] gap-2 w-full">
            {loading ? (
              <>
                {Array.from({ length: 24 }).map((_, index) => (
                  <Skeleton key={index} className="h-54 w-full rounded-md" />
                ))}
              </>
            ) : (
              <>
                {getSortedAndPaginatedItems().map((item) => (
                  <ICOCard
                    key={item.CharacterId}
                    data={item}
                    refresh={() => {
                      fetchCharacterICOData(false);
                    }}
                  />
                ))}
              </>
            )}
          </div>
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={Math.ceil(icoItems.length / 24) || 0}
            onPageChange={setCurrentPage}
            className="flex-1 justify-center mt-4"
          />
        </div>
      </div>
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
          <RecentICOLog onCloseDrawer={() => setDrawerOpen(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
