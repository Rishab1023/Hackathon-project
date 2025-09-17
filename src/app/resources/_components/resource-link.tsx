"use client";

import Link from "next/link";
import { incrementResourceClickCount } from "@/app/actions/analytics-actions";

interface ResourceLinkProps {
    id: string;
    href: string;
    children: React.ReactNode;
    type: 'website' | 'email';
    target?: string;
    rel?: string;
}

export default function ResourceLink({ id, href, children, type, ...props }: ResourceLinkProps) {
  
  const handleClick = async () => {
    try {
      // No need to await, let it run in the background
      incrementResourceClickCount(id);
    } catch (error) {
      console.error("Failed to save resource click count", error);
    }
  };

  const isInternal = href.startsWith('/');

  if (isInternal) {
    return (
        <Link href={href} className="hover:text-primary break-all" onClick={handleClick}>
            {children}
        </Link>
    );
  }

  return (
    <a href={href} className="hover:text-primary break-all" onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
