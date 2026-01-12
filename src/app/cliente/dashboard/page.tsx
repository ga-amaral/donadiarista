'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'
import Link from 'next/link'
import { Plus, List, Calendar, CheckCircle, Clock } from 'lucide-react'

export default function ClienteDashboard() {
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                // Fallback para metadados se o perfil no banco falhar
                setProfile(prof || { name: user.user_metadata?.name || 'Usuário' })

                const { data: ords } = await supabase
                    .from('orders')
                    .select('*, diarista:diarista_id(name)')
                    .eq('cliente_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)
                setOrders(ords || [])
            }
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    )

    return (
        <AppLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">Olá, {profile?.name} 👋</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium tracking-tight">Tudo pronto para deixar seu espaço impecável?</p>
                    </div>

                    <Link
                        href="/cliente/solicitar"
                        className="flex items-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/25 hover:scale-[1.03] active:scale-95 transition-all w-full md:w-auto justify-center group"
                    >
                        <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                        Nova Faxina
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="px-8 py-10 bg-card border border-border/50 rounded-[2rem] shadow-2xl premium-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <CheckCircle size={80} />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pedidos Ativos</p>
                        <div className="flex items-end gap-2">
                            <p className="text-6xl font-black text-foreground leading-none">{orders.filter(o => o.status === 'PAGO').length}</p>
                            <p className="text-slate-400 font-bold mb-1">hoje</p>
                        </div>
                    </div>

                    <Link href="/cliente/pedidos" className="col-span-1 md:col-span-2 px-8 py-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[2rem] hover:bg-indigo-500/10 transition-all group flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Gerenciamento</p>
                                <h3 className="text-2xl font-black text-foreground mb-2">Acompanhe seus pedidos</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Veja o status das suas solicitações em tempo real.</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:translate-x-1 transition-transform">
                                <List size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="text-indigo-500 font-black text-sm mt-6">Ver histórico completo →</div>
                    </Link>
                </div>

                <section className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-2xl premium-shadow">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Calendar size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black text-foreground">Pedidos Recentes</h2>
                        </div>
                        <Link href="/cliente/pedidos" className="text-primary font-black text-sm hover:underline">Ver tudo</Link>
                    </div>

                    <div className="grid gap-4">
                        {orders.map(order => (
                            <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border/10 hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-border/50 flex items-center justify-center text-xl shadow-sm text-foreground">
                                        ✨
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground text-lg">{order.diarista?.name}</p>
                                        <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.start_at).toLocaleDateString('pt-BR')}</span>
                                            <span>•</span>
                                            <span className="truncate max-w-[200px]">{order.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <span className={`mt-4 md:mt-0 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider self-start md:self-center ${order.status === 'PAGO'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-[2rem] border-2 border-dashed border-border">
                                <div className="text-4xl mb-6">🧹</div>
                                <h3 className="text-xl font-black text-foreground mb-2">Sua casa ainda está esperando!</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Peça sua primeira faxina agora e aproveite o conforto de um lar limpo.</p>
                                <Link href="/cliente/solicitar" className="inline-flex px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">Começar agora</Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    )
}
