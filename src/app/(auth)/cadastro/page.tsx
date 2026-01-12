'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState<'CLIENTE' | 'DIARISTA'>('CLIENTE')
    const [city, setCity] = useState('')
    const [uf, setUf] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role,
                    city,
                    uf,
                },
            },
        })

        if (error) {
            setError(error.message)
        } else {
            router.push('/login?message=Verifique seu e-mail para confirmar o cadastro.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-xl bg-card rounded-[2.5rem] shadow-2xl premium-shadow p-10 md:p-14 border border-border/50 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-foreground mb-3">Crie sua conta</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Junte-se à maior rede de diaristas da região.</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl mb-8 border border-red-100 dark:border-red-900/30 text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">Quem é você?</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('CLIENTE')}
                                className={`py-4 rounded-2xl border-2 text-base font-black transition-all ${role === 'CLIENTE'
                                    ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10'
                                    : 'border-border bg-card text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                            >
                                Sou Cliente
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('DIARISTA')}
                                className={`py-4 rounded-2xl border-2 text-base font-black transition-all ${role === 'DIARISTA'
                                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500 shadow-lg shadow-indigo-500/10'
                                    : 'border-border bg-card text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                            >
                                Sou Diarista
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Cidade</label>
                                <input
                                    type="text"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Ex: Bauru"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">UF</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={2}
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                                    placeholder="SP"
                                    className="w-full text-center uppercase"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Senha</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-foreground text-background dark:bg-primary dark:text-white rounded-[1.5rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 dark:shadow-primary/20 mt-4"
                    >
                        {loading ? 'Criando conta...' : 'Cadastrar agora'}
                    </button>
                </form>

                <div className="mt-10 text-center text-slate-500 font-medium">
                    Já tem uma conta? <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 ml-1">Fazer login</Link>
                </div>
            </div>
        </div>
    )
}
