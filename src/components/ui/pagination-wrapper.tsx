import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

type PaginationWrapperProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const MAX_VISIBLE_PAGES = 5;
const ELLIPSIS_THRESHOLD = 4;

const generatePages = (props: PaginationWrapperProps): React.ReactNode[] => {
  const { currentPage, totalPages, onPageChange } = props;

  const createLink = (page: number) => (
    <PaginationLink
      key={`link-${page}`}
      href="#"
      onClick={() => onPageChange(page)}
      isActive={page === currentPage}
      className="cursor-pointer size-8"
    >
      {page}
    </PaginationLink>
  );

  const createEllipsis = (type: 'left' | 'right') => (
    <div
      className="group rounded-md hover:bg-accent cursor-pointer"
      onClick={() => {
        const newPage = type === 'left'
          ? Math.max(1, currentPage - 5)
          : Math.min(totalPages, currentPage + 5);
        onPageChange(newPage);
      }}>
      <PaginationEllipsis key={`${type}-ellipsis-${currentPage}`} className="size-8 group-hover:hidden" />
      {type === 'left' && <span className="hidden group-hover:flex size-8 items-center justify-center">
        <ChevronsLeft className="size-4" />
        <span className="sr-only">More pages</span>
      </span>}
      {type === 'right' && <span className="hidden group-hover:flex size-8 items-center justify-center">
        <ChevronsRight className="size-4" />
        <span className="sr-only">More pages</span>
      </span>}
    </div>
  )

  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => createLink(i + 1));
  }

  if (currentPage <= ELLIPSIS_THRESHOLD) {
    return [
      ...Array.from({ length: MAX_VISIBLE_PAGES }, (_, i) => createLink(i + 1)),
      createEllipsis('right'),
      createLink(totalPages)
    ];
  }

  if (currentPage >= totalPages - (ELLIPSIS_THRESHOLD - 1)) {
    return [
      createLink(1),
      ...(totalPages - MAX_VISIBLE_PAGES > 1 ? [createEllipsis('left')] : []),
      ...Array.from({ length: MAX_VISIBLE_PAGES }, (_, i) =>
        createLink(totalPages - MAX_VISIBLE_PAGES + i + 1)
      )
    ];
  }

  return [
    createLink(1),
    createEllipsis('left'),
    createLink(currentPage - 1),
    createLink(currentPage),
    createLink(currentPage + 1),
    createEllipsis('right'),
    createLink(totalPages)
  ];
};

export const PaginationWrapper = (props: PaginationWrapperProps) => {
  const pages = generatePages(props);

  return (
    <Pagination>
      <PaginationContent>
        {pages.map((component, index) => (
          <PaginationItem key={`item-${index}`}>
            {component}
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
};