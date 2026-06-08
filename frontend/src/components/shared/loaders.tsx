import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton({ variant = "default" }: { variant?: "default" | "hero" | "compact" }) {
  if (variant === "compact") {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-20 w-24 shrink-0 rounded-md" />
        <div className="flex flex-col justify-center space-y-2 flex-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    );
  }

  const isHero = variant === "hero";
  return (
    <div className={`flex flex-col space-y-3 ${isHero ? "h-[400px] md:h-[500px]" : "h-[300px]"}`}>
      <Skeleton className={`w-full rounded-xl ${isHero ? "h-full" : "h-48 md:h-56"}`} />
      {!isHero && (
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-[90%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      )}
    </div>
  );
}

export function GridLoader() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
