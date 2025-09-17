"use client";

import Link from "next/link";

const ANALYTICS_STORAGE_KEY = "resourceAnalytics";

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
      const storedData = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const analytics = storedData ? JSON.parse(storedData) : { totalClicks: 0, clicks: {} };
      
      analytics.totalClicks = (analytics.totalClicks || 0) + 1;
      analytics.clicks[id] = (analytics.clicks[id] || 0) + 1;
      
      const updatedData = JSON.stringify(analytics);
      localStorage.setItem(ANALYTICS_STORAGE_KEY, updatedData);

      // Manually trigger a storage event to notify other components (like admin page)
      window.dispatchEvent(new StorageEvent('storage', {
        key: ANALYTICS_STORAGE_KEY,
        newValue: updatedData,
      }));

    } catch (error) {
      console.error("Failed to save resource click count to localStorage", error);
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
