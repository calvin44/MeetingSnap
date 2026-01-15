'use client'

import { LayoutDashboard, LogOut, Users } from 'lucide-react'
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

  /**
   * Helper to generate link classes based on active state.
   * @param {string} href - The link path.
   * @returns {string} Tailwind classes.
   */
  const getLinkStyles = (href: string): string => {
    const isActive = pathname === href
    const baseClasses =
      'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
    const activeClasses = 'text-blue-600 bg-blue-50'
    const inactiveClasses = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MeetingSnap</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/dashboard"
            aria-current={pathname === '/dashboard' ? 'page' : undefined}
            className={getLinkStyles('/dashboard')}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/team"
            aria-current={pathname === '/dashboard/team' ? 'page' : undefined}
            className={getLinkStyles('/dashboard/team')}
          >
            <Users className="w-4 h-4" />
            Team Members
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
