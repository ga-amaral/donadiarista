'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'

export default function AdminPedidosPage() {
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        loadOrders()
    }, [])

    async function loadOrders() {
        setLoading(true)
        const { data } = await supabase
            .from('orders')
            .select(`
        *,
        cliente:cliente_id (name),
        diarista:diarista_id (name)
      `)
            .order('created_at', { ascending: false })

        setOrders(data || [])
        setLoading(false)
    }

    async function handleCancel(orderId: string) {
        const reason = prompt('Motivo do cancelamento (opcional):')
        const { error } = await supabase
            .from('orders')
            .update({
                status: 'CANCELADO',
                details: reason ? `Cancelado pelo Admin: ${reason}` : 'Cancelado pelo Admin'
            })
            .eq('id', orderId)

        if (error) alert('Erro: ' + error.message)
        else loadOrders()
    }

    return (
        <AppLayout>
            <div className="p-10 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Todos os Pedidos</h1>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden text-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Pedido / Data</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Cliente</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Diarista</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-xs text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map((o) => (
                                <tr key={o.id}>
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-900">{o.city} - {o.uf}</p>
                                        <p className="text-xs text-slate-400">{new Date(o.start_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-5 text-slate-600 font-medium">{o.cliente?.name}</td>
                                    <td className="px-6 py-5 text-slate-600 font-medium">{o.diarista?.name}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'PAGO' ? 'bg-green-100 text-green-700' :
                                                o.status === 'SOLICITADO' ? 'bg-yellow-100 text-yellow-700' :
                                                    o.status === 'CANCELADO' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {o.status !== 'CANCELADO' && o.status !== 'CONCLUIDO' && (
                                            <button
                                                onClick={() => handleCancel(o.id)}
                                                className="text-red-600 hover:underline font-bold text-xs"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && !loading && (
                        <div className="p-20 text-center text-slate-400">Nenhum pedido encontrado.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
