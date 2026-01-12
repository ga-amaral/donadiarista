'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'
import Link from 'next/link'
import { Star, Edit, Wallet, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export default function DiaristaDashboard() {
    const [profile, setProfile] = useState<any>(null)
    const [diaristaProfile, setDiaristaProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                const { data: dProf } = await supabase.from('diarista_profile').select('*').eq('profile_id', user.id).single()

                // Buscar pedidos recentes onde sou o prestador
                const { data: ords } = await supabase
                    .from('orders')
                    .select('*, profiles:cliente_id(name)')
                    .eq('diarista_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(3)

                setProfile(prof || { name: user.user_metadata?.name || 'Diarista' })
                setDiaristaProfile(dProf)
                setOrders(ords || [])
            }
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    )

    const isVerified = diaristaProfile?.status_verificacao === 'APROVADA'

    return (
        <AppLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-10 pb-20">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-4xl md:text-5xl font-black text-foreground">Olá, {profile?.name} 👋</h1>
                            {isVerified && (
                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 size={12} strokeWidth={3} /> Verificada
                                </span>
                            )}
                        </div>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium tracking-tight">Gerencie seus ganhos e agenda em um só lugar.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-8 bg-card border border-border/50 rounded-[2rem] shadow-2xl premium-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUp size={60} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Status da Conta</p>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase inline-block ${diaristaProfile?.status_verificacao === 'APROVADA' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            diaristaProfile?.status_verificacao === 'REPROVADA' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                            {diaristaProfile?.status_verificacao || 'PENDENTE'}
                        </span>
                    </div>

                    <div className="p-8 bg-card border border-border/50 rounded-[2rem] shadow-2xl premium-shadow text-center flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avaliação Geral</p>
                        <div className="flex items-center gap-2">
                            <Star size={24} className="text-amber-400 fill-amber-400" strokeWidth={3} />
                            <p className="text-4xl font-black text-foreground">{diaristaProfile?.rating_avg || '5.0'}</p>
                        </div>
                    </div>

                    <Link href="/diarista/pedidos" className="p-8 bg-white dark:bg-slate-900 border border-border/50 rounded-[2rem] shadow-2xl premium-shadow hover:scale-[1.03] active:scale-95 transition-all flex flex-col justify-between group">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <Wallet size={24} />
                        </div>
                        <div className="mt-6">
                            <p className="font-black text-foreground text-lg">Pedidos</p>
                            <p className="text-slate-400 font-bold text-xs uppercase">Ver solicitações</p>
                        </div>
                    </Link>

                    <Link href="/diarista/perfil" className="p-8 bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-600/30 hover:scale-[1.03] active:scale-95 transition-all flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                            <Edit size={24} />
                        </div>
                        <div className="mt-6 text-white">
                            <p className="font-black text-lg">Seu Perfil</p>
                            <p className="text-white/70 font-bold text-xs uppercase italic">Editar dados</p>
                        </div>
                    </Link>
                </div>

                {!isVerified && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-amber-500/5">
                        <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <AlertCircle size={40} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-black text-amber-600 dark:text-amber-500">Perfil em Análise 🚀</h2>
                            <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl">Complete seus dados e envie seus documentos em "Editar Perfil". Nossa equipe fará a verificação em até 24h para você começar a receber pedidos!</p>
                        </div>
                        <Link href="/diarista/perfil" className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20">
                            Enviar Documentos
                        </Link>
                    </div>
                )}

                <section className="bg-card border border-border/50 rounded-[3rem] p-12 shadow-2xl premium-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[80px]" />
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <Clock size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black text-foreground">Solicitações Recentes</h2>
                        </div>
                        {orders.length > 0 && (
                            <Link href="/diarista/pedidos" className="text-sm font-black text-primary hover:underline">
                                Ver todas
                            </Link>
                        )}
                    </div>

                    <div className="space-y-4">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.id} className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-border/50 flex items-center justify-between group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-primary border border-border/50 uppercase">
                                            {order.profiles?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground">{order.profiles?.name}</p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(order.start_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'SOLICITADO' ? 'bg-amber-100 text-amber-700' :
                                            order.status === 'PAGO' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] border-2 border-dashed border-border/50">
                                <div className="text-5xl mb-6 grayscale opacity-30">📅</div>
                                <p className="text-slate-500 dark:text-slate-400 font-black text-xl italic">Tudo limpo por aqui!</p>
                                <p className="text-slate-400 dark:text-slate-500 font-medium">Fique de olho, novas solicitações aparecerão aqui.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    )
}
