"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/common/logo";
import { MobileNav } from "@/components/common/mobile-nav";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "AI Analyzer" },
  { href: "/resources", label: "Resources" },
  { href: "/schedule", label: "Schedule Session" },
  { href: "/my-sessions", label: "My Sessions" },
  { href: "/chat", label: "Peer Chat" },
];

export function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileNav />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-auto flex items-center space-x-4">
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
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
