"use client";

import { resources } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";


export default function ResourcesPage() {
  const { t, language } = useTranslation();
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    try {
      const storedCounts = localStorage.getItem("resourceClickCount");
      if (storedCounts) {
        setClickCounts(JSON.parse(storedCounts));
      }
    } catch (error) {
      console.error("Failed to load resource click counts", error);
    }
  }, [user]);

  const handleResourceClick = (resourceId: string) => {
    try {
      const newCounts = { ...clickCounts, [resourceId]: (clickCounts[resourceId] || 0) + 1 };
      setClickCounts(newCounts);
      localStorage.setItem("resourceClickCount", JSON.stringify(Object.values(newCounts).reduce((a,b) => a+b, 0)));
    } catch (error) {
      console.error("Failed to save resource click count", error);
    }
  };
  
  const translatedResources = resources.map(resource => {
    const translationKey = `resources.list.${resource.id}`;
    return {
      ...resource,
      name: t(`${translationKey}.name`),
      description: t(`${translationKey}.description`),
      services: resource.services.map((_, serviceIndex) => t(`${translationKey}.services.${serviceIndex}`)),
    };
  });

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          {t('resources.title')}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {t('resources.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {translatedResources.map((resource) => (
          <Card key={resource.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-headline text-xl mb-2 flex items-center gap-2">
                    <resource.icon className="h-6 w-6 text-primary" />
                    {resource.name}
                  </CardTitle>
                   <Badge variant={resource.category === 'National' ? 'secondary' : 'default'} className="capitalize">{t(`resources.categories.${resource.category.toLowerCase().replace(' ', '')}`)}</Badge>
                </div>
              </div>
              <CardDescription className="pt-2">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t('resources.servicesOffered')}:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {resource.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                 <h4 className="font-semibold mb-2">{t('resources.contactInfo')}:</h4>
                {resource.contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{resource.contact.phone}</span>
                  </div>
                )}
                {resource.contact.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${resource.contact.email}`} className="hover:text-primary" onClick={() => handleResourceClick(resource.id)}>{resource.contact.email}</a>
                  </div>
                )}
                {resource.contact.website && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 mt-1" />
                    <Link href={resource.contact.website.startsWith('http') ? resource.contact.website : `https://${resource.contact.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all" onClick={() => handleResourceClick(resource.id)}>
                      {resource.contact.website}
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
