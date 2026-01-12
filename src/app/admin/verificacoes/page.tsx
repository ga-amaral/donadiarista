'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'

export default function AdminVerificacoesPage() {
    const [loading, setLoading] = useState(true)
    const [pending, setPending] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        loadPending()
    }, [])

    async function loadPending() {
        setLoading(true)
        const { data } = await supabase
            .from('profiles')
            .select(`
        *,
        diarista_profile!inner(*),
        diarista_documents(*)
      `)
            .eq('diarista_profile.status_verificacao', 'PENDENTE')

        setPending(data || [])
        setLoading(false)
    }

    async function handleApprove(profileId: string) {
        const { error } = await supabase
            .from('diarista_profile')
            .update({ status_verificacao: 'APROVADA' })
            .eq('profile_id', profileId)

        if (error) alert('Erro: ' + error.message)
        else loadPending()
    }

    async function handleReject(profileId: string) {
        const reason = prompt('Motivo da reprovação:')
        if (!reason) return

        const { error } = await supabase
            .from('diarista_profile')
            .update({
                status_verificacao: 'REPROVADA',
                rejection_reason: reason
            })
            .eq('profile_id', profileId)

        if (error) alert('Erro: ' + error.message)
        else loadPending()
    }

    async function getSignedUrl(path: string) {
        const { data } = await supabase.storage.from('documents').createSignedUrl(path, 60)
        if (data?.signedUrl) window.open(data.signedUrl)
    }

    return (
        <AppLayout>
            <div className="p-10 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Verificações de Diaristas</h1>

                <div className="space-y-6">
                    {pending.map((d) => (
                        <div key={d.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-8">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900">{d.name}</h3>
                                <p className="text-slate-500 mb-4">{d.city} - {d.uf} | {d.phone}</p>
                                <div className="flex gap-2">
                                    {d.diarista_documents.map((doc: any) => (
                                        <button
                                            key={doc.id}
                                            onClick={() => getSignedUrl(doc.storage_path)}
                                            className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200"
                                        >
                                            Ver Doc: {doc.doc_type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 h-fit self-center">
                                <button
                                    onClick={() => handleReject(d.id)}
                                    className="px-6 py-2 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50"
                                >
                                    Reprovar
                                </button>
                                <button
                                    onClick={() => handleApprove(d.id)}
                                    className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-50"
                                >
                                    Aprovar
                                </button>
                            </div>
                        </div>
                    ))}
                    {pending.length === 0 && !loading && (
                        <p className="text-slate-400 text-center py-20">Nenhuma verificação pendente.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
