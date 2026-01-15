export default function DashboardLoading() {
  const skeletons = Array.from({ length: 6 })

  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-72 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-6 w-96 bg-slate-100 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-6 h-[240px] flex flex-col justify-between overflow-hidden relative"
          >
            {/* The Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-50/60 to-transparent" />

            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
                <div className="w-8 h-8 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-100 rounded-md animate-pulse" />
            </div>

            <div className="w-full h-12 bg-slate-200 rounded-xl animate-pulse mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
