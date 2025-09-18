import { BrainCircuit } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold text-primary"
      aria-label="MindMitra Home"
    >
      <BrainCircuit className="h-6 w-6" />
      <span className="font-headline">MindMitra</span>
    </Link>
  );
}
