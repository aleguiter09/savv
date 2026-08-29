"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";

type NavItem = {
  href: string;
  label: string;
};

type Props = Readonly<{
  brand: string;
  navItems: NavItem[];
  loginLabel: string;
  registerLabel: string;
  openMenuLabel: string;
}>;

export function LandingHeader({
  brand,
  navItems,
  loginLabel,
  registerLabel,
  openMenuLabel,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight text-gray-900"
        >
          <Image
            src="/finance.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 object-contain"
          />
          <span className="truncate">{brand}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-600 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{loginLabel}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">{registerLabel}</Link>
            </Button>
          </div>

          <Button size="sm" className="lg:hidden" asChild>
            <Link href="/register">{registerLabel}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 lg:hidden"
                aria-label={openMenuLabel}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle>{brand}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    {loginLabel}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    {registerLabel}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
