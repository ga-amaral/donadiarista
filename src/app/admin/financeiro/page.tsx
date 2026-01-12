'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'

export default function AdminFinanceiroPage() {
    const [loading, setLoading] = useState(true)
    const [payouts, setPayouts] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        loadPayouts()
    }, [])

    async function loadPayouts() {
        setLoading(true)
        const { data } = await supabase
            .from('manual_payouts')
            .select(`
        *,
        diarista:diarista_id (name, phone),
        order:order_id (city, start_at)
      `)
            .order('created_at', { ascending: false })

        setPayouts(data || [])
        setLoading(false)
    }

    async function handleMarkAsPaid(payoutId: string) {
        const reference = prompt('Referência do pagamento (ex: ID da transferência):')
        if (!reference) return

        const { error } = await supabase
            .from('manual_payouts')
            .update({
                status: 'MARCADO_PAGO',
                paid_at: new Date().toISOString(),
                paid_reference: reference
            })
            .eq('id', payoutId)

        if (error) alert('Erro: ' + error.message)
        else loadPayouts()
    }

    return (
        <AppLayout>
            <div className="p-10 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Repasses Manuais (Financeiro)</h1>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden text-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Diarista</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Valor</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {payouts.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-900">{p.diarista?.name}</p>
                                        <p className="text-xs text-slate-400">Serviço em {new Date(p.order?.start_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-5 font-black text-slate-900">R$ {p.amount.toFixed(2)}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'MARCADO_PAGO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {p.status === 'PENDENTE' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(p.id)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100"
                                            >
                                                Marcar como Pago
                                            </button>
                                        )}
                                        {p.status === 'MARCADO_PAGO' && (
                                            <p className="text-xs text-slate-400 italic">Pago em {new Date(p.paid_at).toLocaleDateString()}</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {payouts.length === 0 && !loading && (
                        <div className="p-20 text-center text-slate-400">Nenhum repasse pendente.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
