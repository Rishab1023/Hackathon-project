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
          <div className="flex h-full flex-col mt-8">
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
  );
}
