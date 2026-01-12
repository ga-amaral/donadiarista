import { createClient } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Verify ADMIN role
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

    if (profile?.role !== 'ADMIN') {
        redirect('/')
    }

    // Fetch KPIs
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: pendingDiaristas } = await supabase.from('diarista_profile').select('*', { count: 'exact', head: true }).eq('status_verificacao', 'PENDENTE')
    const { data: paidOrders } = await supabase.from('orders').select('id').eq('status', 'PAGO')
    const { data: payments } = await supabase.from('payments').select('amount')

    const totalRevenue = payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 mb-2">Painel Administrativo</h1>
                <p className="text-slate-500 text-lg">Visão geral do Dona Diarista</p>
            </header>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Usuários</p>
                    <p className="text-5xl font-black text-slate-900">{totalUsers || 0}</p>
                </div>
                <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl shadow-indigo-100">
                    <p className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-2">Pendentes</p>
                    <p className="text-5xl font-black whitespace-nowrap">{pendingDiaristas || 0}</p>
                    <Link href="/admin/verificacoes" className="text-xs font-bold text-indigo-100 hover:underline mt-4 block">Verificar agora →</Link>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Serviços Pagos</p>
                    <p className="text-5xl font-black text-slate-900">{paidOrders?.length || 0}</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Volume Total</p>
                    <p className="text-4xl font-black text-slate-900">R$ {totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                        Atalhos Rápidos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/admin/users" className="p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all font-bold text-slate-700">Gestão de Usuários</Link>
                        <Link href="/admin/verificacoes" className="p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all font-bold text-slate-700">Verificações Diaristas</Link>
                        <Link href="/admin/financeiro" className="p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all font-bold text-slate-700">Financeiro & Repasses</Link>
                        <Link href="/admin/pedidos" className="p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all font-bold text-slate-700">Listagem de Pedidos</Link>
                    </div>
                </section>

                <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                        Logs de Auditoria
                    </h2>
                    <p className="text-slate-400 text-center py-10 italic">Nenhuma atividade recente registrada.</p>
                </section>
            </div>
        </div>
    )
}
