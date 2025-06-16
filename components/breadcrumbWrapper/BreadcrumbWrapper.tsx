import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function BreadcrumbWrapper({
  list = [],
  className = "",
}: {
  list: { href?: string; title: string }[];
  className?: string;
}) {
  if (!list.length) return null;
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {list.map((i, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {i.href ? (
                <BreadcrumbLink href={i.href}>{i.title}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-violet-500">
                  {i.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index !== list.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
