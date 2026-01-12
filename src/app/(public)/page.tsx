'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { CheckCircle2, Star, ShieldCheck, Sparkles, ArrowRight, MousePointer2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans transition-colors duration-500 overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6">
        <nav className="max-w-7xl mx-auto h-20 glass rounded-[2.5rem] flex items-center justify-between px-10 border border-white/20 shadow-2xl">
          <div className="text-3xl font-black bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform cursor-default">
            Dona Diarista
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <Link href="/como-funciona" className="text-sm font-black text-slate-500 hover:text-primary transition-all underline-offset-8 hover:underline">Como funciona</Link>
            <Link href="/precos" className="text-sm font-black text-slate-500 hover:text-primary transition-all underline-offset-8 hover:underline">Preços</Link>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm font-black text-slate-500 hover:text-primary transition-colors">Entrar</Link>
            <Link href="/cadastro" className="px-8 py-4 rounded-2xl bg-foreground text-background dark:bg-primary dark:text-white hover:scale-105 active:scale-95 transition-all text-sm font-black shadow-2xl shadow-slate-200 dark:shadow-primary/20">
              Começar agora
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-40 pb-20">
        {/* Hero Section */}
        <section className="relative px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left space-y-10 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                <Sparkles size={14} strokeWidth={3} /> A excelência que sua casa merece
              </div>

              <h1 className="text-5xl md:text-8xl font-black leading-[0.85] text-foreground tracking-tighter">
                Sua casa <br />
                <span className="text-primary italic relative">
                  sem esforço.
                  <div className="absolute -bottom-2 left-0 w-full h-4 bg-primary/10 rounded-full blur-md -z-10" />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Conectamos você às diaristas mais bem avaliadas da região.
                Segurança, confiança e um padrão de limpeza que vai te surpreender.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
                <Link href="/cliente/solicitar" className="px-12 py-6 bg-primary text-white rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group">
                  Agendar minha limpeza
                  <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/cadastro" className="px-12 py-6 bg-card border-2 border-border/50 text-foreground rounded-3xl font-black text-xl hover:border-primary/50 transition-all flex items-center justify-center">
                  Quero ser Diarista
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-10 border-t border-border/50">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-slate-200 shadow-xl overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-slate-400">
                  Nossa rede cresce <span className="text-primary font-black">+25% ao mês</span> em Bauru.
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full lg:w-auto mt-12 lg:mt-0">
              <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[4rem] bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-900/50 relative overflow-hidden shadow-2xl premium-shadow group border border-border/20">
                <img
                  src="/hero-clean.png"
                  alt="Hero"
                  className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />

                <div className="absolute bottom-10 left-10 right-10 glass p-8 rounded-[2.5rem] border border-white/20 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                      <ShieldCheck size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-black text-lg text-foreground dark:text-white">100% Verificadas</p>
                      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">Segurança máxima para você e sua família.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating labels */}
              <div className="absolute -top-6 -right-6 glass px-6 py-4 rounded-2xl shadow-2xl border border-white/20 animate-bounce delay-500 flex items-center gap-3 z-20">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                <span className="font-black text-sm text-foreground">Top Rated Diaristas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto text-center space-y-6 mb-24">
              <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-none">O padrão ouro em limpeza</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Unimos tecnologia e rigor para garantir que você só receba as melhores profissionais na sua casa.</p>
              <div className="w-24 h-2 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: 'Seleção Rigorosa', desc: 'Apenas 10% das profissionais que se candidatam são aprovadas em nossa plataforma.', icon: <CheckCircle2 size={32} />, color: 'bg-emerald-500' },
                { title: 'Preço Transparente', desc: 'Sem taxas ocultas. Você vê o valor final e paga com segurança no cartão ou Pix.', icon: <Star size={32} />, color: 'bg-indigo-500' },
                { title: 'Suporte VIP', desc: 'Qualquer dúvida ou imprevisto, nossa equipe está pronta para te ajudar em minutos.', icon: <Sparkles size={32} />, color: 'bg-amber-500' }
              ].map((item, idx) => (
                <div key={idx} className="p-12 bg-card border border-border/50 rounded-[3rem] shadow-2xl premium-shadow hover:translate-y-[-12px] transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-slate-500/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700" />
                  <div className={`w-20 h-20 ${item.color} text-white rounded-[1.8rem] flex items-center justify-center mb-10 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-6">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 relative pb-20">
          <div className="max-w-7xl mx-auto bg-slate-950 dark:bg-slate-900 rounded-[4rem] p-16 md:p-24 text-center space-y-12 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent -z-10" />
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter">Pronto para ter <br /> sua casa nova de novo?</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/cadastro" className="px-12 py-6 bg-primary text-white rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20">Criar minha conta gratis</Link>
              <Link href="/contato" className="px-12 py-6 bg-white/10 text-white rounded-3xl font-black text-xl hover:bg-white/20 transition-all border border-white/20">Falar com suporte</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 px-10 border-t border-border/50 bg-card">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-2 space-y-8">
            <div className="text-3xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Dona Diarista
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed text-lg">
              Revolucionando a forma como você cuida do seu lar. Segurança, rapidez e a qualidade que você exige.
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">📸</div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">🐦</div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">💬</div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Marketplace</h4>
            <div className="flex flex-col gap-5 text-slate-500 dark:text-slate-400 font-bold text-sm">
              <Link href="#" className="hover:text-primary transition-colors">Como Agendar</Link>
              <Link href="#" className="hover:text-primary transition-colors">Diaristas Verificadas</Link>
              <Link href="#" className="hover:text-primary transition-colors">Preços & Taxas</Link>
              <Link href="#" className="hover:text-primary transition-colors">Segurança</Link>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Informações</h4>
            <div className="flex flex-col gap-5 text-slate-500 dark:text-slate-400 font-bold text-sm">
              <Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-primary transition-colors">Trabalhe Conosco</Link>
              <Link href="#" className="hover:text-primary transition-colors">Nossa Missão</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-border/50 text-xs font-bold text-slate-400 flex flex-col md:flex-row items-center justify-between gap-8">
          <p>© 2026 Dona Diarista. Uma criação de <a href="https://instagram.com/sougabrielamaral" target="_blank" className="text-foreground hover:text-primary underline underline-offset-4">Gabriel Amaral</a>.</p>
          <div className="flex items-center gap-10">
            <span className="flex items-center gap-2"><ShieldCheck size={14} /> Dados criptografados</span>
            <span className="flex items-center gap-2"><Sparkles size={14} /> Orgulhosamente Bauruense</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
