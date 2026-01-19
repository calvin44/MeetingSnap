import { getDocumentTabs } from '@/lib/services/tabs'
import { ArrowRight, ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const tabs = await getDocumentTabs()

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Meeting Documents
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Select a tab to extract meeting notes and summaries.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          {tabs.length} Tabs Available
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tabs.length > 0 ? (
          tabs.map((tab) => (
            <div
              key={tab.id}
              className="group relative bg-white border border-slate-200 rounded-[2rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500 shadow-sm">
                  <FileText className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>

              <h3 className="font-extrabold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors truncate tracking-tight">
                {tab.title}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                ID: {tab.id.substring(0, 8)}
              </p>

              <Link
                href={`/dashboard/preview/${tab.id}?title=${encodeURIComponent(tab.title)}`}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg hover:shadow-blue-600/25"
              >
                Preview Document
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
            <div className="bg-slate-50 p-8 rounded-full mb-6">
              <FileText className="w-12 h-12 text-slate-300" />
            </div>
            <p className="text-xl text-slate-500 font-bold tracking-tight">No tabs found in this document.</p>
            <p className="text-slate-400 mt-2">Try refreshing the connection or checking your document.</p>
          </div>
        )}
      </div>
    </div>
  )
}
