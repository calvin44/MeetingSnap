import { getDocumentTabs } from '@/lib/services/tabs'
import { ArrowRight, ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const tabs = await getDocumentTabs()

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Meeting Documents
          </h1>
          <p className="text-slate-500 mt-1">
            Select a tab to extract meeting notes and summaries.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {tabs.length} Tabs Available
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tabs.length > 0 ? (
          tabs.map((tab) => (
            <div
              key={tab.id}
              className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
                  <FileText className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
                {tab.title}
              </h3>
              <p className="text-xs font-mono text-slate-400 mb-6">
                ID: {tab.id.substring(0, 8)}...
              </p>

              <Link
                href={`/dashboard/preview/${tab.id}?title=${encodeURIComponent(tab.title)}`}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
              >
                Preview
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No tabs found in this document.</p>
          </div>
        )}
      </div>
    </div>
  )
}
