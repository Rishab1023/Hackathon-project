"use client";

import Link from "next/link";
import { db } from "@/lib/firebase";
import { ref, runTransaction, serverTimestamp } from "firebase/database";


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
    const resourceAnalyticsRef = ref(db, `analytics/resources`);
    try {
      await runTransaction(resourceAnalyticsRef, (currentData) => {
        if (currentData) {
          currentData.totalClicks = (currentData.totalClicks || 0) + 1;
          currentData[resourceId] = (currentData[resourceId] || 0) + 1;
        } else {
          currentData = {
            totalClicks: 1,
            [resourceId]: 1,
          };
        }
        return currentData;
      });
    } catch (e) {
      console.error("Transaction failed: ", e);
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
