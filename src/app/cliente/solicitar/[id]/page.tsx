'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter, useParams } from 'next/navigation'
import AppLayout from '@/components/app-layout'
import { Calendar, MapPin, MessageSquare, ArrowRight } from 'lucide-react'

export default function FinalizarSolicitacaoPage() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [diarista, setDiarista] = useState<any>(null)
    const [address, setAddress] = useState('')
    const [date, setDate] = useState('')
    const [details, setDetails] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        async function loadDiarista() {
            const { data } = await supabase
                .from('profiles')
                .select('name, city, uf, diarista_pricing(daily_price)')
                .eq('id', id)
                .single()
            setDiarista(data)
            setLoading(false)
        }
        loadDiarista()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const { data: { user } } = await supabase.auth.getUser()

        const startAt = new Date(date)
        const endAt = new Date(startAt.getTime() + 8 * 60 * 60 * 1000) // Default 8h duration
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h expiration

        const { error } = await supabase.from('orders').insert({
            cliente_id: user!.id,
            diarista_id: id,
            city: diarista.city,
            uf: diarista.uf,
            address,
            start_at: startAt.toISOString(),
            end_at: endAt.toISOString(),
            details,
            status: 'SOLICITADO',
            total_price: diarista.diarista_pricing?.[0]?.daily_price || 0,
            requested_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString()
        })

        if (error) {
            alert('Erro ao enviar pedido: ' + error.message)
        } else {
            router.push('/cliente/dashboard?message=Solicitação enviada! Aguarde a resposta da diarista.')
        }
        setSubmitting(false)
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
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="p-10 max-w-2xl mx-auto space-y-10 animate-fade-in">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Finalizar Solicitação</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Preencha os detalhes para agendar sua faxina.</p>
                </header>

                <div className="bg-card border border-border/50 rounded-[3rem] p-10 md:p-14 shadow-2xl premium-shadow space-y-10">
                    <div className="flex items-center gap-6 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/20">
                            {diarista.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Diarista Selecionada</p>
                            <h3 className="font-black text-foreground text-2xl tracking-tight">{diarista.name}</h3>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-1">
                                <MapPin size={16} className="text-primary" /> Endereço Completo
                            </label>
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full"
                                placeholder="Rua, número, bairro..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-1">
                                <Calendar size={16} className="text-primary" /> Data e Hora do Serviço
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-1">
                                <MessageSquare size={16} className="text-primary" /> Observações (opcional)
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="w-full h-32 py-4 px-6"
                                placeholder="Ex: Focar nos banheiros, tenho animais de estimação..."
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                {submitting ? (
                                    'Processando...'
                                ) : (
                                    <>
                                        Confirmar Agendamento
                                        <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
