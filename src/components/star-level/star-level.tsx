import {
  AiFillMoon,
  AiFillStar,
  AiFillSun,
  AiOutlineStar,
} from 'react-icons/ai';

/**
 * 星级
 * @param props
 * @param {number} props.level 星级
 * @param {number} props.size 大小
 */
export function StarLevel({ level = 0, size = 5 }) {
  const totalStars = Math.max(0, level);
  const suns = Math.floor(totalStars / 25);
  const moons = Math.floor((totalStars % 25) / 5);
  const remainingStars = totalStars % 5;

  const renderIcons = (count: number, IconComponent: React.ElementType) => {
    return Array.from({ length: count }).map((_, i) => (
      <IconComponent key={i} className={`size-${size}`} />
    ));
  };

  return (
    <>
      {level > 0 ? (
        <>
          {renderIcons(suns, AiFillSun)}
          {renderIcons(moons, AiFillMoon)}
          {renderIcons(remainingStars, AiFillStar)}
        </>
      ) : (
        <AiOutlineStar className={`size-${size}`} />
      )}
    </>
  );
}
