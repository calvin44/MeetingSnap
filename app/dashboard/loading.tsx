export default function DashboardLoading() {
  const skeletons = Array.from({ length: 6 })

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-12 w-80 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-6 w-[32rem] bg-slate-100 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-[2rem] p-8 h-[300px] flex flex-col justify-between overflow-hidden relative shadow-sm"
          >
            {/* The Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-50/80 to-transparent" />

            <div className="space-y-6">
              <div className="flex justify-between">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse" />
                <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-7 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-5 w-1/2 bg-slate-100 rounded-md animate-pulse" />
              </div>
            </div>

            <div className="w-full h-14 bg-slate-200 rounded-2xl animate-pulse mt-6" />
          </div>
        ))}
      </div>
    </div>
  )
}
