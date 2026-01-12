'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-border/50" />
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group overflow-hidden"
            aria-label="Alternar tema"
        >
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />

            <div className={`transform transition-all duration-500 ease-spring ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                <Sun size={20} className="text-amber-500 fill-amber-500/10" />
            </div>

            <div className={`absolute transform transition-all duration-500 ease-spring ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
                <Moon size={20} className="text-indigo-400 fill-indigo-400/10" />
            </div>
        </button>
    )
}
