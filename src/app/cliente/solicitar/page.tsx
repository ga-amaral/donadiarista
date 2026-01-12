'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'
import Link from 'next/link'
import { Star, ArrowRight, CheckCircle2, Filter, Search, X, MapPin, ChevronDown, DollarSign } from 'lucide-react'

const REGIONAL_CITIES = [
    'Bauru', 'Agudos', 'Pederneiras', 'Piratininga', 'Lençóis Paulista', 'Jaú', 'Macatuba', 'Duartina'
]

export default function SolicitarPage() {
    const [loading, setLoading] = useState(true)
    const [diaristas, setDiaristas] = useState<any[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        city: '',
        maxPrice: 300,
        minRating: 0
    })

    const supabase = createClient()

    useEffect(() => {
        async function loadInitialData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: prof } = await supabase.from('profiles').select('city').eq('id', user.id).single()
                if (prof?.city) {
                    setFilters(prev => ({ ...prev, city: prof.city }))
                }
            }
        }
        loadInitialData()
    }, [])

    useEffect(() => {
        async function fetchDiaristas() {
            setLoading(true)
            let query = supabase
                .from('profiles')
                .select(`
                    *,
                    diarista_profile!inner (*),
                    diarista_pricing!inner (*)
                `)
                .eq('role', 'DIARISTA')
                .eq('diarista_profile.status_verificacao', 'APROVADA')


            if (filters.city) {
                query = query.contains('diarista_profile.serviced_cities', [filters.city])
            }

            if (filters.maxPrice) {
                query = query.lte('diarista_pricing.daily_price', filters.maxPrice)
            }

            if (filters.minRating) {
                query = query.gte('diarista_profile.rating_avg', filters.minRating)
            }

            const { data } = await query.order('name')
            setDiaristas(data || [])
            setLoading(false)
        }
        fetchDiaristas()
    }, [filters])

    return (
        <AppLayout>
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="p-10 max-w-7xl mx-auto space-y-12">
                <header className="space-y-6 animate-fade-in relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm mb-4">
                                <MapPin size={14} strokeWidth={3} /> Encontre sua diarista
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] mb-4">
                                Profissionais em <br />
                                <span className="text-indigo-500">{filters.city || 'Toda Região'}</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg">
                                Selecionamos apenas as melhores profissionais da região de Bauru para garantir sua total satisfação e segurança.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-xl ${showFilters ? 'bg-primary text-white shadow-primary/20' : 'bg-card border border-border/50 text-foreground hover:bg-slate-50'}`}
                        >
                            {showFilters ? <X size={20} /> : <Filter size={20} />}
                            {showFilters ? 'Fechar Filtros' : 'Filtrar Resultados'}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="p-8 bg-card/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] shadow-2xl premium-shadow animate-in fade-in slide-in-from-top-4 duration-500 grid grid-cols-1 md:grid-cols-12 gap-10 relative overflow-hidden group">
                            <div className="md:col-span-4 space-y-4">
                                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <MapPin size={12} strokeWidth={3} /> Cidade da Região
                                </label>
                                <div className="relative">
                                    <select
                                        value={filters.city}
                                        onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                                        className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent hover:border-primary/30 rounded-2xl px-6 py-4 font-black text-sm text-foreground appearance-none transition-all outline-none focus:bg-white dark:focus:bg-slate-900 shadow-inner"
                                    >
                                        <option value="">Qualquer Cidade</option>
                                        {REGIONAL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div className="md:col-span-4 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <DollarSign size={12} strokeWidth={3} /> Preço Máximo
                                    </label>
                                    <span className="text-sm font-black text-foreground bg-primary/10 px-3 py-1 rounded-lg">R$ {filters.maxPrice}</span>
                                </div>
                                <div className="pt-2">
                                    <input
                                        type="range"
                                        min="100"
                                        max="500"
                                        step="10"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary transition-all active:scale-[0.98]"
                                    />
                                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">
                                        <span>R$ 100</span>
                                        <span>R$ 500</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-4 space-y-4">
                                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <Star size={12} strokeWidth={3} /> Avaliação Mínima
                                </label>
                                <div className="flex gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-transparent">
                                    {[0, 3, 4, 4.5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                                            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${filters.minRating === rating ? 'bg-white dark:bg-slate-800 text-primary shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-foreground'}`}
                                        >
                                            {rating === 0 ? 'Todas' : `${rating}+`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-card/50 border border-border/50 rounded-[2.5rem] p-10 space-y-8 animate-pulse">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
                                    <div className="space-y-3 flex-1">
                                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3" />
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3" />
                                </div>
                                <div className="pt-8 border-t border-border/20 flex justify-between items-center">
                                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
                                    <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-32" />
                                </div>
                            </div>
                        ))
                    ) : diaristas.length > 0 ? (
                        diaristas.map((d, idx) => (
                            <div
                                key={d.id}
                                className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-xl premium-shadow hover:translate-y-[-10px] transition-all group animate-fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">
                                        {d.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-foreground text-2xl tracking-tight leading-tight mb-1">{d.name}</h3>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-black">
                                            <Star size={14} fill="currentColor" />
                                            <span>{
                                                (Array.isArray(d.diarista_profile) ? d.diarista_profile[0]?.rating_avg : d.diarista_profile?.rating_avg) || '5.0'
                                            }</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 line-clamp-3">
                                    {(Array.isArray(d.diarista_profile) ? d.diarista_profile[0]?.bio : d.diarista_profile?.bio) || 'Esta profissional ainda não preencheu sua biografia, mas já foi aprovada em nosso rigoroso teste de qualidade.'}
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-border/30">
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Preço Sugerido</p>
                                        <p className="font-black text-foreground text-3xl tracking-tighter">
                                            <span className="text-sm font-bold text-slate-400 mr-1">R$</span>
                                            {
                                                (Array.isArray(d.diarista_pricing) ? d.diarista_pricing[0]?.daily_price : d.diarista_pricing?.daily_price) || '0.00'
                                            }
                                        </p>
                                    </div>
                                    <Link
                                        href={`/cliente/solicitar/${d.id}`}
                                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                                    >
                                        Solicitar <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-24 text-center glass rounded-[3rem] space-y-6">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={48} className="text-slate-400" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground tracking-tight">Nenhuma profissional encontrada</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                                No momento, não temos diaristas verificadas disponíveis em sua cidade. Mas não se preocupe, estamos expandindo rápido!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
