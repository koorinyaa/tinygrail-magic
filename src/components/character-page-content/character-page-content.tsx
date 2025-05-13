import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { GensokyoCharacters } from './components/gensokyo-characters';
import { STCharacters } from './components/st-characters';
import { TinygrailCharacters } from './components/tinygrail-characters';
import { RankCharacters } from './components/rank-characters';

/**
 * 角色内容区域
 * @param props
 */
export function CharacterPageContent() {
  const [selectedCategory, setSelectedCategory] = useState('tinygrail'); // 选中的分类

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
      <div className="mb-6 flex flex-wrap flex-row items-center justify-between">
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
      <div>{renderContent()}</div>
    </div>
  );
}
