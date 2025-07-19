// src/components/ui/SkeletonCard.tsx
export function SkeletonCard() {
    return (
      <div className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 h-[110px] w-full mb-2" />
    );
  }

export function SkeletonChart() {
  return (
    <div className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 h-[350px] w-full mb-4" />
  );
}