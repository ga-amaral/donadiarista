'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'
import { CreditCard, QrCode, ShieldCheck, Loader2, ArrowRight, Lock } from 'lucide-react'

export default function PagamentoPage() {
    const { id } = useParams()
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE')
    const [method, setMethod] = useState<'CARD' | 'PIX'>('CARD')
    const supabase = createClient()
    const router = useRouter()

    async function handleSimulatePayment() {
        setStatus('PROCESSING')
        await new Promise(resolve => setTimeout(resolve, 2500))

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'PAGO' })
                .eq('id', id)

            if (error) throw error
            setStatus('SUCCESS')
            setTimeout(() => router.push('/cliente/pedidos?success=true'), 2000)
        } catch (err) {
            console.error(err)
            alert('Erro ao processar simulação')
            setStatus('IDLE')
        }
    }

    if (status === 'PROCESSING') return (
        <AppLayout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 text-center animate-fade-in">
                <div className="w-24 h-24 bg-card border border-border/50 rounded-3xl flex items-center justify-center relative shadow-2xl premium-shadow mb-8">
                    <Loader2 size={48} className="text-primary animate-spin" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">Validando transação...</h2>
                <p className="text-slate-500 font-medium">Não feche esta janela enquanto o simulador processa seu pagamento seguro.</p>
            </div>
        </AppLayout>
    )

    if (status === 'SUCCESS') return (
        <AppLayout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 text-center animate-scale-up">
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center relative shadow-xl mb-8">
                    <ShieldCheck size={48} className="text-emerald-500" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">Pagamento <span className="text-emerald-500">Confirmado!</span></h2>
                <p className="text-slate-500 font-medium">Seu pedido foi atualizado e a profissional será notificada.</p>
            </div>
        </AppLayout>
    )

    return (
        <AppLayout>
            <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10 pb-32">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Lock size={12} /> Checkout Seguro (Simulado)
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter">Finalizar Contratação</h1>
                    </div>
                </header>

                <div className="grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-8 space-y-8">
                        {/* Tabs de Metodo */}
                        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-2 h-16">
                            <button
                                onClick={() => setMethod('CARD')}
                                className={`flex-1 rounded-xl flex items-center justify-center gap-3 font-black text-sm transition-all ${method === 'CARD' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-foreground'}`}
                            >
                                <CreditCard size={18} /> Cartão de Crédito
                            </button>
                            <button
                                onClick={() => setMethod('PIX')}
                                className={`flex-1 rounded-xl flex items-center justify-center gap-3 font-black text-sm transition-all ${method === 'PIX' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-foreground'}`}
                            >
                                <QrCode size={18} /> PIX (Instantâneo)
                            </button>
                        </div>

                        {method === 'CARD' ? (
                            <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl premium-shadow space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número do Cartão</label>
                                        <input disabled placeholder="**** **** **** 4242" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border/30 rounded-xl px-6 py-4 font-bold text-foreground opacity-70" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Validade</label>
                                            <input disabled placeholder="MM / YY" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border/30 rounded-xl px-6 py-4 font-bold text-foreground opacity-70" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                                            <input disabled placeholder="***" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border/30 rounded-xl px-6 py-4 font-bold text-foreground opacity-70" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSimulatePayment}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                                >
                                    Pagar com Cartão (Simulado) <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="bg-card border border-border/50 rounded-[2.5rem] p-12 shadow-2xl premium-shadow text-center space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                                <div className="w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-dashed border-border/50 overflow-hidden group">
                                    <QrCode size={120} className="text-slate-300 dark:text-slate-800 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-black text-foreground">Escaneie o QR Code no seu banco</p>
                                    <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">Após escanear, o pagamento será reconhecido instantaneamente pelo simulador.</p>
                                </div>
                                <button
                                    onClick={handleSimulatePayment}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3"
                                >
                                    Confirmar PIX (Simulado) <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-border/30 rounded-[2rem] p-8 space-y-6">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Resumo do Pedido</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Serviço de Limpeza</span>
                                    <span className="font-black text-foreground">R$ 180,00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Taxa de Plataforma</span>
                                    <span className="font-black text-foreground">R$ 15,00</span>
                                </div>
                                <div className="h-px bg-border/20 pt-4" />
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-black text-foreground">Total</span>
                                    <span className="text-2xl font-black text-indigo-500">R$ 195,00</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-4">
                            <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                                Seus fundos estarão protegidos até a conclusão do serviço pela profissional.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
