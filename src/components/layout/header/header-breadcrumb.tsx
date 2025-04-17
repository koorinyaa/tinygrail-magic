import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useStore } from "@/store";

export function HeaderBreadcrumb({ className = '', ...props }: { className?: string }) {
  const { currentPage } = useStore();

  return (
    <Breadcrumb
      className={className}
      {...props}
    >
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage.main.title}</BreadcrumbPage>
        </BreadcrumbItem>
        {currentPage.sub &&
          <BreadcrumbSeparator />}
        {currentPage.sub &&
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage.sub.title}</BreadcrumbPage>
          </BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  )
}