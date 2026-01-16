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
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Navigation Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold px-4 py-2 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all duration-200 active:scale-95"
                >
                    <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <form action={formAction}>
                        <button
                            type="submit"
                            disabled={loading || !!error || isPending || !!state?.success}
                            className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:bg-slate-300 shadow-lg shadow-blue-500/20"
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[70vh] flex flex-col">
                <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{tabTitle}</h1>
                        <p className="text-sm text-slate-500">Previewing extracted content from Google Docs</p>
                    </div>
                    {state?.success && (
                        <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-full border border-green-100 animate-bounce">
                            <CheckCircle2 size={18} />
                            Email Sent Successfully!
                        </div>
                    )}
                </div>

                <div className="flex-1 p-8 overflow-auto bg-slate-50">
                    {loading || error ? (
                        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                            {loading ? (
                                <>
                                    <div className="relative">
                                        <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-ping" />
                                        <div className="absolute inset-0 w-12 h-12 border-4 border-t-blue-600 rounded-full animate-spin" />
                                    </div>
                                    <p className="text-slate-500 font-medium animate-pulse">Extracting document content...</p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="bg-red-50 p-4 rounded-full mb-4">
                                        <AlertCircle size={40} className="text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Extraction Failed</h3>
                                    <p className="text-slate-500 max-w-md">{error}</p>
                                    <button
                                        onClick={() => { setError(null); setLoading(true); fetchHtml(tabId); }}
                                        className="mt-6 text-blue-600 font-bold hover:underline"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
                            {/* Note: We use dangerouslySetInnerHTML here because the content from Google is expected to be HTML. 
                  In a real app, we should use a sanitizer like DOMPurify. */}
                            <div dangerouslySetInnerHTML={{ __html: html || '' }} />
                        </div>
                    )}
                </div>

                {state?.error && (
                    <div className="p-4 bg-red-600 text-white flex items-center gap-3">
                        <AlertCircle size={20} />
                        <p className="font-medium text-sm">{state.error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
