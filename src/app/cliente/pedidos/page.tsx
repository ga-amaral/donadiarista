'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'
import Link from 'next/link'
import { Calendar, MapPin, Search, MessageSquare, ExternalLink, X, CreditCard } from 'lucide-react'

export default function ClientePedidosPage() {
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState<any[]>([])
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
    const supabase = createClient()

    useEffect(() => {
        loadOrders()
    }, [])

    async function loadOrders() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('orders')
                .select(`
            *,
            diarista:diarista_id (
                name,
                diarista_pricing(daily_price)
            )
          `)
                .eq('cliente_id', user.id)
                .order('created_at', { ascending: false })

            setOrders(data || [])
        }
        setLoading(false)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    )

    return (
        <AppLayout>
            <div className="p-6 max-w-5xl mx-auto space-y-10 pb-20">
                <header className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">Seus Pedidos</h1>
                    <p className="text-lg text-slate-500 font-medium tracking-tight">Gerencie suas limpezas e pagamentos em um só lugar.</p>
                </header>

                <div className="grid gap-6">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className="bg-card glass border border-border/50 rounded-[2.5rem] p-8 shadow-2xl premium-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-10 hover:border-primary/20 transition-all">
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${order.status === 'SOLICITADO' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                            order.status === 'ACEITO_AGUARDANDO_PAGAMENTO' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' :
                                                order.status === 'PAGO' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-border/50'
                                            }`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl">
                                            <Calendar size={14} /> {new Date(order.start_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-black text-foreground text-2xl mb-2 flex items-center gap-2">
                                            Diarista: {order.diarista?.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                                            <MapPin size={16} className="text-primary" />
                                            {order.address}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    {order.status === 'ACEITO_AGUARDANDO_PAGAMENTO' && (
                                        <Link
                                            href={`/cliente/pagamento/${order.id}`}
                                            className="flex-1 md:flex-none px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all text-center shadow-xl shadow-primary/30"
                                        >
                                            Pagar Agora
                                        </Link>
                                    )}

                                    {order.status === 'PAGO' && (
                                        <a
                                            href={`https://wa.me/5514999999999?text=Oi, sou cliente da Dona Diarista. Gostaria de combinar os detalhes do serviço do dia ${new Date(order.start_at).toLocaleDateString()}.`}
                                            target="_blank"
                                            className="flex-1 md:flex-none px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all text-center shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3"
                                        >
                                            <MessageSquare size={20} strokeWidth={3} />
                                            WhatsApp
                                        </a>
                                    )}

                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-4 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-2xl border border-border/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <ExternalLink size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center bg-card border border-border/50 rounded-[3rem] shadow-2xl premium-shadow space-y-6">
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-2xl font-black text-foreground">Nenhum pedido encontrado</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Você ainda não agendou nenhuma limpeza. Que tal começar agora?</p>
                            <Link href="/cliente/solicitar" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                <Search size={20} strokeWidth={3} />
                                Buscar Diaristas
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalhes */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
                        onClick={() => setSelectedOrder(null)}
                    />
                    <div className="relative w-full max-w-2xl bg-card border border-white/20 dark:border-slate-800/50 rounded-[3rem] shadow-2xl premium-shadow overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[80px]" />

                        <div className="p-10 md:p-14 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Detalhes do Pedido
                                    </div>
                                    <h2 className="text-4xl font-black text-foreground tracking-tighter">
                                        Limpeza com <br />
                                        <span className="text-indigo-500">{selectedOrder.diarista?.name}</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-all z-50 shadow-sm"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} /> Data do Serviço
                                        </label>
                                        <p className="text-xl font-black text-foreground">
                                            {new Date(selectedOrder.start_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <CreditCard size={12} /> Valor do Serviço
                                        </label>
                                        <p className="text-xl font-black text-indigo-500">
                                            {selectedOrder.total_price
                                                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.total_price)
                                                : 'Sob consulta'}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={12} /> Endereço Completo
                                        </label>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            {selectedOrder.address}<br />
                                            {selectedOrder.city} - {selectedOrder.uf}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <MessageSquare size={12} /> Observações
                                        </label>
                                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-border/30 rounded-2xl">
                                            <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm leading-relaxed">
                                                {selectedOrder.details || 'Nenhuma observação informada.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status do Pedido</label>
                                        <div className="flex">
                                            <span className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${selectedOrder.status === 'PAGO' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                                                selectedOrder.status === 'SOLICITADO' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' :
                                                    'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                }`}>
                                                {selectedOrder.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
