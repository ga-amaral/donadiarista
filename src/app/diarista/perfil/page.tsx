'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/app-layout'
import { User, DollarSign, FileText, Upload, CheckCircle2, AlertCircle, Info, ArrowRight, MapPin } from 'lucide-react'

const REGIONAL_CITIES = [
    'Bauru', 'Agudos', 'Pederneiras', 'Piratininga', 'Lençóis Paulista', 'Jaú', 'Macatuba', 'Duartina'
]

export default function DiaristaPerfilPage() {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [diaristaProfile, setDiaristaProfile] = useState<any>(null)
    const [price, setPrice] = useState('0')
    const [bio, setBio] = useState('')
    const [servicedCities, setServicedCities] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<any>(null)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return router.push('/login')

            const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            const { data: dProf } = await supabase.from('diarista_profile').select('*').eq('profile_id', user.id).single()
            const { data: dPrice } = await supabase.from('diarista_pricing').select('*').eq('profile_id', user.id).single()

            setProfile(prof)
            setDiaristaProfile(dProf)
            setBio(dProf?.bio || '')
            setServicedCities(dProf?.serviced_cities || [])
            setPrice(dPrice?.daily_price?.toString() || '0')
            setLoading(false)
        }
        loadData()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        const { error: error1 } = await supabase
            .from('diarista_profile')
            .update({ bio, serviced_cities: servicedCities })
            .eq('profile_id', profile.id)

        const { error: error2 } = await supabase
            .from('diarista_pricing')
            .update({ daily_price: parseFloat(price) })
            .eq('profile_id', profile.id)

        if (error1 || error2) {
            setMessage({ type: 'error', text: 'Erro ao salvar perfil profissional.' })
        } else {
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        }
        setSaving(false)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const { data: { user } } = await supabase.auth.getUser()
        const filePath = `${user!.id}/${Date.now()}_${file.name}`

        const { error } = await supabase.storage
            .from('documents')
            .upload(filePath, file)

        if (error) {
            setMessage({ type: 'error', text: 'Erro no upload: ' + error.message })
        } else {
            await supabase.from('diarista_documents').insert({
                profile_id: user!.id,
                doc_type: 'IDENTIDADE',
                storage_path: filePath,
                status: 'ENVIADO'
            })
            setMessage({ type: 'success', text: 'Documento enviado para análise com sucesso!' })
        }
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
                        <User size={14} strokeWidth={3} /> Perfil Profissional
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                        Sua <span className="text-indigo-500">Identidade</span>
                    </h1>
                </header>

                {message && (
                    <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-scale-up border shadow-xl ${message.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <p className="font-black text-sm">{message.text}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="bg-card border border-border/50 rounded-[3rem] p-10 md:p-14 shadow-2xl premium-shadow space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <FileText size={20} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black text-foreground">Informações de Trabalho</h2>
                        </div>

                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 ml-1">Biografia Profissional</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full h-48 py-4 px-6"
                                    placeholder="Conte sobre sua experiência, especialidades e como você gosta de trabalhar..."
                                />
                                <p className="text-[10px] text-slate-400 font-medium ml-1">Esta bio aparecerá quando os clientes buscarem por você.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 ml-1">Valor Médio da Diária</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</div>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full pl-14"
                                        placeholder="Ex: 150.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 ml-1">Cidades que você atende</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {REGIONAL_CITIES.map((city) => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => {
                                                setServicedCities(prev =>
                                                    prev.includes(city)
                                                        ? prev.filter(c => c !== city)
                                                        : [...prev, city]
                                                )
                                            }}
                                            className={`p-3 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 ${servicedCities.includes(city)
                                                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                                    : 'bg-slate-50 dark:bg-slate-900 border-border/50 text-slate-500'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${servicedCities.includes(city) ? 'bg-primary border-primary text-white' : 'border-slate-300'
                                                }`}>
                                                {servicedCities.includes(city) && <CheckCircle2 size={10} strokeWidth={4} />}
                                            </div>
                                            {city}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium ml-1 flex items-center gap-1">
                                    <MapPin size={10} /> Selecione as cidades onde você aceita realizar serviços.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {saving ? 'Salvando...' : (<>Salvar Alterações <ArrowRight size={20} /></>)}
                            </button>
                        </form>
                    </div>

                    <div className="space-y-10">
                        <div className="bg-card border border-border/50 rounded-[3rem] p-10 md:p-14 shadow-2xl premium-shadow space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Upload size={120} />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <CheckCircle2 size={20} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-black text-foreground">Verificação de Conta</h2>
                            </div>

                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Para garantir a segurança de todos, exigimos uma foto do seu documento de identidade (RG ou CNH).
                            </p>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border/10 flex gap-4">
                                <Info size={20} className="text-primary shrink-0" />
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Seus dados são criptografados e nunca serão compartilhados com terceiros. Somente nossa equipe de moderação tem acesso.
                                </p>
                            </div>

                            <div className="relative group">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleFileUpload}
                                />
                                <div className="border-2 border-dashed border-border/50 rounded-[2rem] p-12 text-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="text-slate-400 group-hover:text-primary transition-colors" size={32} />
                                    </div>
                                    <p className="font-black text-foreground text-lg">Clique ou arraste o arquivo</p>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">PNG, JPG ou PDF (Max. 10MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
