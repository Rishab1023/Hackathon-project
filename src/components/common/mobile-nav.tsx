"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Menu, LogIn, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/logo";
import { useTranslation } from "@/hooks/use-translation";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavLink {
  href: string;
  label: string;
  auth?: boolean;
  admin?: boolean;
}

interface MobileNavProps {
  navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, setLanguage, language } = useTranslation();
  const { user, logout } = useAuth();

  const handleLinkClick = () => setIsOpen(false);
  const handleLogout = () => {
    logout();
    handleLinkClick();
  }

  const handleLanguageChange = (lang: "en" | "hi") => {
    setLanguage(lang);
    setIsOpen(false);
  }

  return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
              <Logo />
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="flex flex-col justify-between h-full mt-8 pr-6">
              <div className="flex-grow">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary"
                      onClick={handleLinkClick}
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                </nav>
                <Separator className="my-8" />
                {user ? (
                    <div className="flex flex-col space-y-4">
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2" /> Logout
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-4">
                        <Button asChild variant="outline" onClick={handleLinkClick}>
                            <Link href="/login"><LogIn className="mr-2"/> Login</Link>
                        </Button>
                        <Button asChild onClick={handleLinkClick}>
                            <Link href="/signup"><UserPlus className="mr-2"/> Sign Up</Link>
                        </Button>
                    </div>
                )}
              </div>
              <div className="mt-8 space-y-4 pt-8">
                  <div className="flex items-center justify-between">
                      <h3 className="font-medium flex items-center gap-2"><Globe className="h-5 w-5"/> {language === 'en' ? 'Language' : 'भाषा'}</h3>
                      <ThemeToggle />
                  </div>
                <div className="flex flex-col space-y-2">
                    <Button variant={language === 'en' ? 'secondary' : 'outline'} onClick={() => handleLanguageChange("en")}>English</Button>
                    <Button variant={language === 'hi' ? 'secondary' : 'outline'} onClick={() => handleLanguageChange("hi")}>हिंदी (Hindi)</Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
  );
}
