import { resources } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "@/lib/get-translation";
import ResourceLink from "./_components/resource-link";

export default async function ResourcesPage() {
  const t = await getTranslations();

  const translatedResources = resources.map(resource => {
    const translationKey = `resources.list.${resource.id}`;
    return {
      ...resource,
      name: t(`${translationKey}.name`),
      description: t(`${translationKey}.description`),
      services: resource.services.map((_, serviceIndex) => t(`${translationKey}.services.${serviceIndex}`)),
    };
  });


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
                     <ResourceLink type="email" id={resource.id} href={`mailto:${resource.contact.email}`}>
                        {resource.contact.email}
                    </ResourceLink>
                  </div>
                )}
                {resource.contact.website && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 mt-1" />
                    <ResourceLink type="website" id={resource.id} href={resource.contact.website} target="_blank" rel="noopener noreferrer">
                        {resource.contact.website}
                    </ResourceLink>
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
