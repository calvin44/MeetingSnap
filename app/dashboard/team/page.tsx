import { AddMemberForm } from '@/app/components/AddMemberForm'
import { DeleteMemberButton } from '@/app/components/DeleteMemberForm'
import { getWhitelistedUsers } from '@/lib/db'
import { ShieldCheck, User, Users } from 'lucide-react'
import { getServerSession } from 'next-auth'

export default async function TeamPage() {
  const session = await getServerSession()
  const currentUserEmail = session?.user?.email
  const members = await getWhitelistedUsers()

  const sortedMembers = [...members].sort((a, b) => {
    if (a.email === currentUserEmail) return -1
    if (b.email === currentUserEmail) return 1
    return 0
  })

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Team Management</h1>
          <p className="text-slate-500 font-medium text-lg">Manage authorized users for MeetingSnap.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-bold shadow-sm shadow-emerald-500/5 ring-4 ring-emerald-500/5">
          <ShieldCheck size={20} className="animate-pulse" />
          Admin Mode Active
        </div>
      </div>

      <div className="grid gap-12">
        {/* We should eventually polish the AddMemberForm component too, but keeping it for now */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <AddMemberForm />
        </div>

        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between backdrop-blur-sm">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <Users size={16} className="text-blue-500" />
              Active Members ({members.length})
            </h2>
          </div>

          <ul className="divide-y divide-slate-100">
            {sortedMembers.map((member) => {
              const isSelf = member.email === currentUserEmail
              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between p-8 hover:bg-slate-50/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-transform duration-500 group-hover:scale-110 shadow-sm ${isSelf
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-100 shadow-blue-500/20'
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}
                    >
                      {isSelf ? <User size={24} /> : member.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-slate-900 tracking-tight">{member.email}</span>
                        {isSelf && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm ring-1 ring-blue-500/10">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        Joined {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {!isSelf ? (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <DeleteMemberButton id={member.id} />
                    </div>
                  ) : (
                    <div className="px-5 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ring-blue-500/5">
                      Current User
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
