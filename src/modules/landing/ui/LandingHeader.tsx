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
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-gray-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 font-[family-name:var(--font-landing-display)] text-base font-semibold tracking-tight text-gray-900"
        >
          <Image
            src="/finance.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span>{brand}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-gray-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" className="min-h-10" asChild>
            <Link href="/login">{loginLabel}</Link>
          </Button>
          <Button size="sm" className="min-h-10" asChild>
            <Link href="/register">{registerLabel}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button size="sm" className="min-h-10 px-3" asChild>
            <Link href="/register">{registerLabel}</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="min-h-10 min-w-10"
                aria-label={openMenuLabel}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="font-[family-name:var(--font-landing-display)]">
                  {brand}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-3 text-sm text-gray-700 hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                <Button variant="outline" className="min-h-11 w-full" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    {loginLabel}
                  </Link>
                </Button>
                <Button className="min-h-11 w-full" asChild>
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
