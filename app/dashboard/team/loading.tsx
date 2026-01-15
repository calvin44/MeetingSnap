export default function TeamLoading() {
  const rows = Array.from({ length: 5 })

  return (
    <div className="min-h-full max-w-5xl mx-auto space-y-8">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-9 w-64 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-5 w-80 bg-slate-100 rounded-md animate-pulse" />
        </div>
        {/* Badge Skeleton */}
        <div className="h-9 w-40 bg-emerald-50/50 border border-emerald-100 rounded-full animate-pulse" />
      </div>

      <div className="grid gap-8">
        {/* 2. AddMemberForm Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-32 flex items-center">
          <div className="flex-1 h-12 bg-slate-100 rounded-xl animate-pulse mr-4" />
          <div className="w-32 h-12 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        {/* 3. Members List Skeleton */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* List Title */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          </div>

          <ul className="divide-y divide-slate-100">
            {rows.map((_, i) => (
              <li key={i} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  {/* Avatar Circle */}
                  <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />

                  <div className="flex flex-col gap-2">
                    {/* Email line */}
                    <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                    {/* "Added Date" line */}
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>

                {/* Delete Button Skeleton */}
                <div className="h-10 w-10 bg-slate-100 rounded-lg animate-pulse" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
