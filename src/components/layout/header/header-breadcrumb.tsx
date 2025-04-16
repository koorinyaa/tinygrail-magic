import { useAppState } from "@/components/app-state-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export function HeaderBreadcrumb({ className = '', ...props }: { className?: string }) {
  const { state } = useAppState()

  return (
    <Breadcrumb
      className={className}
      {...props}
    >
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{state.currentPage.main.title}</BreadcrumbPage>
        </BreadcrumbItem>
        {state.currentPage.sub &&
          <BreadcrumbSeparator />}
        {state.currentPage.sub &&
          <BreadcrumbItem>
            <BreadcrumbPage>{state.currentPage.sub.title}</BreadcrumbPage>
          </BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  )
}