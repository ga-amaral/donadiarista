'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import AppLayout from '@/components/app-layout'

export default function AdminUsersPage() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<any[]>([])
    const [search, setSearch] = useState('')

    const supabase = createClient()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        setLoading(true)
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        setUsers(data || [])
        setLoading(false)
    }

    async function toggleBan(userId: string, currentBanStatus: boolean) {
        let reason = ''
        if (!currentBanStatus) {
            reason = prompt('Motivo do banimento:') || 'Sem motivo informado'
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                is_banned: !currentBanStatus,
                banned_reason: !currentBanStatus ? reason : null,
                banned_at: !currentBanStatus ? new Date().toISOString() : null
            })
            .eq('id', userId)

        if (error) alert('Erro: ' + error.message)
        else loadUsers()
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AppLayout>
            <div className="p-10 max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou cidade..."
                        className="px-6 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 w-80 shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </header>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nome</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Localização</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-900">{u.name}</p>
                                        <p className="text-xs text-slate-400">{u.phone || 'Sem telefone'}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'DIARISTA' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 text-sm">
                                        {u.city} - {u.uf}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => toggleBan(u.id, u.is_banned)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${u.is_banned
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            {u.is_banned ? 'Desbanir' : 'Banir'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && !loading && (
                        <div className="p-20 text-center text-slate-400">Nenhum usuário encontrado.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
