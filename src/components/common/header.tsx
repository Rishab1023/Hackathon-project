"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { MobileNav } from "@/components/common/mobile-nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export const navLinks = [
  { href: "/", label: "nav.analyzer" },
  { href: "/resources", label: "nav.resources" },
  { href: "/schedule", label: "nav.schedule" },
  { href: "/my-sessions", label: "nav.mySessions" },
  { href: "/chat", label: "nav.chat" },
  { href: "/admin", label: "nav.admin" },
];

export function Header() {
  const pathname = usePathname();
  const { t, setLanguage } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
            <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
                <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                >
                <Link href={link.href}>{t(link.label)}</Link>
                </Button>
            ))}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Change language</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hi")}>
                    हिंदी (Hindi)
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </nav>
            <div className="md:hidden">
              <MobileNav navLinks={navLinks} />
            </div>
        </div>
      </div>
    </header>
  );
}
