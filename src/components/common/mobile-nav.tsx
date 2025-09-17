"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/common/logo";
import { useTranslation } from "@/hooks/use-translation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "nav.analyzer" },
  { href: "/resources", label: "nav.resources" },
  { href: "/schedule", label: "nav.schedule" },
  { href: "/my-sessions", label: "nav.mySessions" },
  { href: "/chat", label: "nav.chat" },
  { href: "/admin", label: "nav.admin" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, setLanguage } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b pb-4">
                <Logo />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Change language</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {setLanguage("en"); setIsOpen(false);}}>
                        English
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {setLanguage("hi"); setIsOpen(false);}}>
                        हिंदी (Hindi)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="mt-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(link.label)}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
