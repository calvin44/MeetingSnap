'use client'

import { ActionState, sendEmailAction } from './actions'
import { AlertCircle, ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useActionState, useEffect, useState, use } from 'react'

interface PreviewPageProps {
    params: Promise<{ tabId: string }>
}

/**
 * Preview Page: Fetches HTML from the extraction API and allows sending via Server Action.
 * Uses an iframe for CSS isolation of the exported Google Doc content.
 */
export default function PreviewPage({ params }: PreviewPageProps) {
    const { tabId } = use(params)
    const searchParams = useSearchParams()
    const tabTitle = searchParams.get('title') || 'Meeting Notes'

    const [html, setHtml] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch HTML content based on the unwrapped tabId
    useEffect(() => {
        if (!tabId) return
        fetchHtml(tabId)
    }, [tabId])

    const fetchHtml = async (id: string) => {
        try {
            const res = await fetch('/api/extract-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tabId: id }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to extract content')
            }

            const data = await res.json()
            setHtml(data.html)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    // Handle Send Action
    const sendWithData = sendEmailAction.bind(null, {
        tabId: tabId || '',
        tabTitle,
        html: html || '',
    })

    const [state, formAction, isPending] = useActionState<ActionState, FormData>(sendWithData, null)

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation Header - Glassmorphism */}
            <div className="sticky top-6 z-50 flex items-center justify-between bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-lg shadow-slate-200/50">
                <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold px-4 py-2 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white/50 transition-all duration-200 active:scale-95"
                >
                    <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <form action={formAction}>
                        <button
                            type="submit"
                            disabled={loading || !!error || isPending || !!state?.success}
                            className="cursor-pointer flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:from-slate-300 disabled:to-slate-300 shadow-xl shadow-blue-500/25 ring-4 ring-blue-500/10"
                        >
                            {isPending ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : state?.success ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <Send size={18} />
                            )}
                            {isPending ? 'Sending...' : state?.success ? 'Dispatched!' : 'Send to Team'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden min-h-[70vh] flex flex-col transition-all duration-500 hover:shadow-blue-500/5">
                <div className="border-b border-slate-100 p-8 bg-slate-50/30 flex items-center justify-between backdrop-blur-sm">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{tabTitle}</h1>
                        <p className="text-sm text-slate-500 font-medium">Previewing extracted content from Google Docs</p>
                    </div>
                    {state?.success && (
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-2.5 rounded-full border border-green-100 animate-in zoom-in-95 duration-300">
                            <CheckCircle2 size={18} />
                            Email Sent Successfully!
                        </div>
                    )}
                </div>

                <div className="flex-1 p-8 md:p-12 overflow-auto bg-slate-50/30">
                    {loading ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-100 rounded-md w-full" />
                                <div className="h-4 bg-slate-100 rounded-md w-5/6" />
                                <div className="h-4 bg-slate-100 rounded-md w-full" />
                                <div className="h-4 bg-slate-100 rounded-md w-4/5" />
                            </div>
                            <div className="h-32 bg-slate-100 rounded-xl w-full" />
                            <div className="space-y-3 pt-4">
                                <div className="h-4 bg-slate-100 rounded-md w-full" />
                                <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="min-h-[50vh] flex flex-col items-center justify-center p-12 text-center">
                            <div className="bg-red-50 p-6 rounded-3xl mb-6 ring-8 ring-red-50/50">
                                <AlertCircle size={48} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Extraction Failed</h3>
                            <p className="text-slate-500 max-w-md font-medium leading-relaxed">{error}</p>
                            <button
                                onClick={() => { setError(null); setLoading(true); fetchHtml(tabId); }}
                                className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors active:scale-95 shadow-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-8 md:p-16 rounded-[2rem] shadow-sm border border-slate-100 prose prose-slate max-w-none ring-1 ring-slate-100">
                            <div dangerouslySetInnerHTML={{ __html: html || '' }} className="preview-content" />
                        </div>
                    )}
                </div>

                {state?.error && (
                    <div className="p-4 bg-red-600 text-white flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle size={20} />
                        <p className="font-bold text-sm">{state.error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
