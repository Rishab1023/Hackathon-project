"use client";

import Image from "next/image";
import { AIPredictionTool } from "@/components/home/ai-prediction-tool";
import { useTranslation } from "@/hooks/use-translation";
import { AuthGuard } from "@/components/auth/auth-guard";


export default function Home() {
  const { t } = useTranslation();

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {t('home.title')}
            </h1>
            <p className="max-w-[600px] mx-auto md:mx-0 text-muted-foreground md:text-xl">
              {t('home.description')}
            </p>
          </div>
          <div className="order-first flex justify-center md:order-last">
            <Image
              src="https://picsum.photos/seed/mindbloom-hero/600/400"
              alt={t('home.heroAlt')}
              data-ai-hint="supportive environment"
              width={600}
              height={400}
              className="rounded-lg object-cover shadow-2xl"
              priority
            />
          </div>
        </section>

        <section className="mt-16 md:mt-24">
          <AIPredictionTool />
        </section>
      </div>
    </AuthGuard>
  );
}
