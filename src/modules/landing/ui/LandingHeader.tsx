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

type Props = Readonly<{
  brand: string;
  loginLabel: string;
  registerLabel: string;
  openMenuLabel: string;
}>;

export function LandingHeader({
  brand,
  loginLabel,
  registerLabel,
  openMenuLabel,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top">
          <Image
            src="/margo-logo.png"
            alt={brand}
            width={140}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </a>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" asChild>
            <Link href="/login">{loginLabel}</Link>
          </Button>
          <Button asChild>
            <Link href="/register">{registerLabel}</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={openMenuLabel}
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,20rem)]">
            <SheetHeader>
              <SheetTitle>{brand}</SheetTitle>
            </SheetHeader>
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
    </header>
  );
}
