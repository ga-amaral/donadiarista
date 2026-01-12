'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'
import { Calendar, MapPin, Clock, MessageSquare, Check, X, AlertCircle } from 'lucide-react'

export default function DiaristaPedidosPage() {
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        loadOrders()
    }, [])

    async function loadOrders() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        const { data } = await supabase
            .from('orders')
            .select(`
        *,
        profiles:cliente_id (name, phone)
      `)
            .eq('diarista_id', user!.id)
            .order('created_at', { ascending: false })

        setOrders(data || [])
        setLoading(false)
    }

    async function handleAction(orderId: string, status: 'ACEITO_AGUARDANDO_PAGAMENTO' | 'REJEITADO') {
        const { error } = await supabase
            .from('orders')
            .update({
                status,
                responded_at: new Date().toISOString()
            })
            .eq('id', orderId)

        if (error) alert('Erro ao atualizar status: ' + error.message)
        else loadOrders()
    }

    if (loading) return (
        <AppLayout>
            <div className="p-20 text-center animate-pulse space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-48 mx-auto" />
            </div>
        </AppLayout>
    )

    return (
        <AppLayout>
            <div className="p-10 max-w-6xl mx-auto space-y-12 pb-32">
                <header className="space-y-4 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <Clock size={14} strokeWidth={3} /> Gerenciamento de Serviços
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                        Suas <span className="text-indigo-500">Solicitações</span>
                    </h1>
                </header>

                <div className="grid gap-6">
                    {orders.length > 0 ? (
                        orders.map((order, idx) => (
                            <div
                                key={order.id}
                                className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-2xl premium-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-10 hover:border-indigo-500/20 transition-all animate-fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${order.status === 'SOLICITADO' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                            order.status === 'ACEITO_AGUARDANDO_PAGAMENTO' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' :
                                                order.status === 'PAGO' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-border/50'
                                            }`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
                                            <Calendar size={14} /> Solicitado em {new Date(order.requested_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-black text-foreground text-3xl mb-4 tracking-tight">{order.profiles?.name}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                                                    <MapPin size={18} />
                                                </div>
                                                <span className="text-sm">{order.address}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                                                    <Calendar size={18} />
                                                </div>
                                                <span className="text-sm">{new Date(order.start_at).toLocaleString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {order.details && (
                                        <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex gap-4">
                                            <MessageSquare size={20} className="text-indigo-500 shrink-0" />
                                            <p className="text-slate-500 dark:text-slate-400 text-sm italic">"{order.details}"</p>
                                        </div>
                                    )}
                                </div>

                                {order.status === 'SOLICITADO' && (
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => handleAction(order.id, 'REJEITADO')}
                                            className="flex-1 md:flex-none p-5 bg-red-500/10 text-red-500 rounded-2xl font-black group hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                        >
                                            <X size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(order.id, 'ACEITO_AGUARDANDO_PAGAMENTO')}
                                            className="flex-1 md:flex-none px-8 py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3"
                                        >
                                            <Check size={20} strokeWidth={3} />
                                            Aceitar Serviço
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-24 text-center glass rounded-[3rem] space-y-6">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={48} className="text-slate-400" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground tracking-tight">Nenhuma solicitação</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                                Tudo tranquilo por aqui no momento. Assim que surgirem novas oportunidades, elas aparecerão aqui.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
