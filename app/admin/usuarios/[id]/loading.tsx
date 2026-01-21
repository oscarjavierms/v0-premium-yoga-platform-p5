import { Skeleton } from "@/components/ui/skeleton"

export default function UserDetailLoading() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
