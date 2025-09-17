import Image from "next/image";
import { AIPredictionTool } from "@/components/home/ai-prediction-tool";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Welcome to MindBloom
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Your safe space for understanding and improving student mental
            well-being. Use our AI tool to get insights or explore our
            resources.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://picsum.photos/seed/mindbloom-hero/600/400"
            alt="A person in a calm, supportive environment"
            data-ai-hint="supportive environment"
            width={600}
            height={400}
            className="rounded-lg object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="mt-16 md:mt-24">
        <AIPredictionTool />
      </section>
    </div>
  );
}
