'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { LogOut, Home, LayoutDashboard } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const [dashboardUrl, setDashboardUrl] = useState('/')

    useEffect(() => {
        async function getRole() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const role = user.user_metadata?.role || (user.email?.includes('diarista') ? 'diarista' : 'cliente')
                // Se o pathname já começa com diarista ou cliente, podemos inferir a role
                const detectedRole = pathname.split('/')[1]
                if (detectedRole === 'diarista' || detectedRole === 'cliente') {
                    setDashboardUrl(`/${detectedRole}/dashboard`)
                } else {
                    setDashboardUrl(`/${role}/dashboard`)
                }
            }
        }
        getRole()
    }, [pathname])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-500 relative overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <header className="fixed top-0 left-0 w-full z-50 px-6 py-4">
                <nav className="max-w-7xl mx-auto h-16 glass rounded-2xl flex items-center justify-between px-8 border border-white/10 shadow-2xl">
                    <Link href={dashboardUrl} className="text-2xl font-black bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform animate-gradient">
                        Dona Diarista
                    </Link>

                    <div className="flex items-center gap-4 md:gap-6">
                        <Link
                            href={dashboardUrl}
                            className={`flex items-center gap-2 text-sm font-black transition-all group ${pathname.includes('dashboard') ? 'text-primary' : 'text-slate-500 hover:text-primary'
                                }`}
                        >
                            <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden md:block">Painel</span>
                        </Link>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                        <ThemeToggle />

                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-red-500 transition-all group"
                        >
                            <span className="hidden md:block">Sair</span>
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </nav>
            </header>

            <main className="flex-1 pt-28">
                {children}
            </main>
        </div>
    )
}
