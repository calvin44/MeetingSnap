'use client'

import { LayoutDashboard, LogOut, Users, Sparkles } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * Shared layout for the dashboard.
 * Uses usePathname to highlight the active navigation item.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const getLinkStyles = (href: string): string => {
    const isActive = pathname === href
    const baseClasses =
      'flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300'
    const activeClasses = 'text-blue-600 bg-blue-50 shadow-sm shadow-blue-500/5 ring-1 ring-blue-500/10'
    const inactiveClasses = 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 group'

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
  }

  return (
    <div className="flex h-screen bg-white bg-grid font-medium">
      <aside className="w-80 bg-white border-r border-slate-200/60 flex flex-col transition-all duration-500 shadow-2xl shadow-slate-200/50 z-10 relative">
        <div className="p-10 pb-12">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform duration-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-slate-900 leading-tight">
                MeetingSnap
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 px-0.5 mt-0.5">
                Project Meeting
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <div className="px-4 py-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</span>
          </div>

          <Link
            href="/dashboard"
            aria-current={pathname === '/dashboard' ? 'page' : undefined}
            className={getLinkStyles('/dashboard')}
          >
            <div className={`p-1.5 rounded-lg ${pathname === '/dashboard' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600'} transition-colors`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            Dashboard
          </Link>

          <Link
            href="/dashboard/team"
            aria-current={pathname === '/dashboard/team' ? 'page' : undefined}
            className={getLinkStyles('/dashboard/team')}
          >
            <div className={`p-1.5 rounded-lg ${pathname === '/dashboard/team' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600'} transition-colors`}>
              <Users className="w-4 h-4" />
            </div>
            Team Members
          </Link>
        </nav>

        <div className="p-8 mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center justify-center gap-3 w-full px-4 py-4 text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        <div className="p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
