import {Skeleton} from "@heroui/react";

export default function LoadingSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <Skeleton className="h-58 w-full rounded-xl" />
      <Skeleton className="h-58 w-full rounded-xl" />
      <Skeleton className="h-58 w-full rounded-xl" />
      <Skeleton className="h-58 w-full rounded-xl" />
    </div>
  );
}


