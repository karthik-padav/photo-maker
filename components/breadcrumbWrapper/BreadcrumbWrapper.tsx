import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadcrumbWrapper({
  list = [],
}: {
  list: { href?: string; title: string }[];
}) {
  if (!list.length) return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {list.map((i, index) => (
          <>
            <BreadcrumbItem>
              {i.href ? (
                <BreadcrumbLink href={i.href}>{i.title}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{i.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index !== list.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
