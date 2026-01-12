'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Erro de login:', error.message)
            setError(error.message)
            setLoading(false)
        } else {
            console.log('Login bem-sucedido, verificando permissões...')

            // Prioridade 1: Metadados da sessão (mais rápido e sempre disponível se cadastrado via app)
            const role = data.user?.user_metadata?.role

            if (role) {
                console.log('Role encontrada nos metadados:', role)
                if (role === 'ADMIN') router.push('/admin')
                else if (role === 'DIARISTA') router.push('/diarista/dashboard')
                else router.push('/cliente/dashboard')
                return
            }

            // Prioridade 2: Buscar no banco de dados (fallback)
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

            if (profileError) {
                console.error('Erro ao buscar perfil no banco:', {
                    code: profileError.code,
                    message: profileError.message
                })
                // Fallback final: se não achou nada, vai pro dashboard de cliente para não travar o usuário
                router.push('/cliente/dashboard')
                return
            }

            console.log('Perfil encontrado no banco, redirecionando para:', profile?.role)
            if (profile?.role === 'ADMIN') router.push('/admin')
            else if (profile?.role === 'DIARISTA') router.push('/diarista/dashboard')
            else router.push('/cliente/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md bg-card rounded-[2.5rem] shadow-2xl premium-shadow p-10 md:p-14 border border-border/50 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-foreground mb-3">Bem-vindo(a)</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Acesse sua conta para continuar.</p>
                </div>

                {message && (
                    <div className="bg-primary/5 text-primary p-5 rounded-2xl mb-8 border border-primary/10 text-sm font-bold">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl mb-8 border border-red-100 dark:border-red-900/30 text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
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

                    <div>
                        <div className="flex items-center justify-between mb-2 ml-1">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Senha</label>
                            <Link href="/recuperar" className="text-xs font-bold text-primary hover:underline">Esqueceu a senha?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-foreground text-background dark:bg-primary dark:text-white rounded-[1.5rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 dark:shadow-primary/20 mt-4"
                    >
                        {loading ? 'Entrando...' : 'Entrar na conta'}
                    </button>
                </form>

                <div className="mt-10 text-center text-slate-500 font-medium">
                    Ainda não tem conta? <Link href="/cadastro" className="text-primary font-black hover:underline underline-offset-4 ml-1">Crie agora</Link>
                </div>
            </div>
        </div>
    )
}
