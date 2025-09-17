"use client";

import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";


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
    const resourceAnalyticsDocRef = doc(db, "analytics", "resources");
    try {
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(resourceAnalyticsDocRef);
        if (!docSnap.exists()) {
          transaction.set(resourceAnalyticsDocRef, { totalClicks: 1, [resourceId]: 1 });
        } else {
          const data = docSnap.data();
          const newTotal = (data.totalClicks || 0) + 1;
          const newResourceCount = (data[resourceId] || 0) + 1;
          transaction.update(resourceAnalyticsDocRef, {
            totalClicks: newTotal,
            [resourceId]: newResourceCount,
          });
        }
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
