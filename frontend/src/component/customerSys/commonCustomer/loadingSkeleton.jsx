import { Skeleton } from "@radix-ui/themes";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton height="192px" />
          <Skeleton height="24px" width="80%" />
          <Skeleton height="16px" />
          <Skeleton height="16px" width="60%" />
        </div>
      ))}
    </div>
  );
}