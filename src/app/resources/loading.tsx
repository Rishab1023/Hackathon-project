import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ResourcesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-pulse">
      <div className="space-y-4 text-center mb-12">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-1/4" />
                </div>
              </div>
               <Skeleton className="h-4 w-full mt-2" />
               <Skeleton className="h-4 w-5/6 mt-1" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between space-y-4">
              <div>
                <Skeleton className="h-5 w-1/3 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                 <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
