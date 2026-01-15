import { AddMemberForm } from '@/app/components/AddMemberForm'
import { DeleteMemberButton } from '@/app/components/DeleteMemberForm'
import { getWhitelistedUsers } from '@/lib/db'
import { ShieldCheck, User } from 'lucide-react'
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
    <div className="min-h-full max-w-5xl mx-auto space-y-8 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Management</h1>
          <p className="text-slate-600 mt-2 text-lg">Manage authorized users for MeetingSnap.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold">
          <ShieldCheck size={18} />
          Admin Mode Active
        </div>
      </div>

      <div className="grid gap-8">
        <AddMemberForm />

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Active Members ({members.length})
            </h2>
          </div>

          <ul className="divide-y divide-slate-100">
            {sortedMembers.map((member) => {
              const isSelf = member.email === currentUserEmail
              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border ${
                        isSelf
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {isSelf ? <User size={18} /> : member.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{member.email}</span>
                        {isSelf && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">
                        Added {new Date(member.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!isSelf ? (
                    <DeleteMemberButton id={member.id} />
                  ) : (
                    <div className="text-xs text-slate-400 font-medium italic px-3">
                      Active Session
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
