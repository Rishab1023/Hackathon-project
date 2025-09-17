"use client";

import Link from "next/link";

const RESOURCE_ANALYTICS_KEY = "mindbloom-resource-analytics";

interface ResourceLinkProps {
    id: string;
    href: string;
    children: React.ReactNode;
    type: 'website' | 'email';
    target?: string;
    rel?: string;
}

export default function ResourceLink({ id, href, children, type, ...props }: ResourceLinkProps) {
  
  const incrementResourceClickCount = async (resourceId: string): Promise<void> => {
    try {
      const analytics = JSON.parse(localStorage.getItem(RESOURCE_ANALYTICS_KEY) || "{}");
      analytics.totalClicks = (analytics.totalClicks || 0) + 1;
      analytics[resourceId] = (analytics[resourceId] || 0) + 1;
      localStorage.setItem(RESOURCE_ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.error("Failed to update resource analytics in local storage: ", e);
    }
  }

  const handleClick = () => {
    try {
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
