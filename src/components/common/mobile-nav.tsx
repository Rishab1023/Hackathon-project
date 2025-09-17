"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/logo";
import { useTranslation } from "@/hooks/use-translation";
import { Separator } from "@/components/ui/separator";

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
  const { t, setLanguage, language } = useTranslation();

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
            <SheetHeader className="flex-row items-center justify-between">
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </Button>
            </SheetHeader>
            <div className="flex h-full flex-col mt-8">
              <nav className="flex flex-col space-y-4">
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
              <Separator className="my-8" />
              <div className="space-y-4">
                 <h3 className="font-medium flex items-center gap-2"><Globe className="h-5 w-5"/> {language === 'en' ? 'Language' : 'भाषा'}</h3>
                 <div className="flex flex-col space-y-2">
                    <Button variant={language === 'en' ? 'default' : 'outline'} onClick={() => {setLanguage("en"); setIsOpen(false);}}>English</Button>
                    <Button variant={language === 'hi' ? 'default' : 'outline'} onClick={() => {setLanguage("hi"); setIsOpen(false);}}>हिंदी (Hindi)</Button>
                 </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
