"use client";

import Link from "next/link";
import { trackResourceClick } from "@/app/actions/analytics-actions";

interface ResourceLinkProps {
    id: string;
    href: string;
    children: React.ReactNode;
    type: 'website' | 'email';
    target?: string;
    rel?: string;
}

export default function ResourceLink({ id, href, children, ...props }: ResourceLinkProps) {
  
  const handleClick = () => {
    try {
      trackResourceClick(id);
    } catch (error) {
      console.error("Failed to track resource click:", error);
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
