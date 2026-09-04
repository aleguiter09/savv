"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/modules/shared/utils/cn";
import { buttonVariants } from "@/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MovementsScope } from "../../types/types";

type Props = Readonly<{
  page: number;
  total: number;
  pageSize: number;
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
  scope: MovementsScope;
}>;

function buildHref(
  targetPage: number,
  from: Date,
  to: Date,
  accountId: string,
  categoryId: string,
  scope: MovementsScope,
) {
  const params = new URLSearchParams();
  params.set("account", accountId);
  params.set("category", categoryId);

  if (scope === "upcoming") {
    params.set("scope", "upcoming");
  } else {
    params.set("from", format(from, "yyyy-MM-dd"));
    params.set("to", format(to, "yyyy-MM-dd"));
  }

  if (targetPage > 1) {
    params.set("page", String(targetPage));
  }
  return `/movements?${params.toString()}`;
}

export function MovementsPagination({
  page,
  total,
  pageSize,
  from,
  to,
  accountId,
  categoryId,
  scope,
}: Props) {
  const t = useTranslations("movements");
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground">
        {t("pageOf", { page, total: totalPages })}
      </p>
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <Link
                href={buildHref(
                  page - 1,
                  from,
                  to,
                  accountId,
                  categoryId,
                  scope,
                )}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "gap-1 pl-2.5",
                )}
                aria-label={t("previous")}
              >
                <ChevronLeft />
                <span>{t("previous")}</span>
              </Link>
            </PaginationItem>
          )}
          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <Link
                href={buildHref(
                  pageNumber,
                  from,
                  to,
                  accountId,
                  categoryId,
                  scope,
                )}
                aria-current={pageNumber === page ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: pageNumber === page ? "outline" : "ghost",
                    size: "icon",
                  }),
                )}
              >
                {pageNumber}
              </Link>
            </PaginationItem>
          ))}
          {page < totalPages && (
            <PaginationItem>
              <Link
                href={buildHref(
                  page + 1,
                  from,
                  to,
                  accountId,
                  categoryId,
                  scope,
                )}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "gap-1 pr-2.5",
                )}
                aria-label={t("next")}
              >
                <span>{t("next")}</span>
                <ChevronRight />
              </Link>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
