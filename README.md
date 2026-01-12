# Dona Diarista - MVP v1.0.0

Marketplace que conecta Clientes a Diaristas verificadas, focado inicialmente no Interior de SP (DDD 014).

## 🚀 Tecnologias
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Backend:** Supabase (Auth, Postgres, Storage, RLS).
- **Pagamentos:** Stripe (Checkout Session & Webhooks).

## ⚙️ Setup Local

### 1. Clonar e Instalar
```bash
npm install
```

### 2. Variáveis de Ambiente (.env.local)
Crie o arquivo `.env.local` na raiz com as chaves obtidas no Supabase e Stripe:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=uma-chave-segura
```

### 3. Banco de Dados (Supabase)
Execute o SQL fornecido nas migrations para criar as tabelas, RLS e triggers.

### 4. Stripe Cli (Webhooks)
Para testar webhooks localmente:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 🔐 Segurança
- **RLS:** Todas as tabelas possuem Row Level Security.
- **Admin:** Somente usuários com `role = ADMIN` acessam `/admin`.
- **Diaristas:** Passam por verificação manual via upload de documentos no Storage privado.

## 🗺️ Fluxos
1. **Diarista:** Cadastra -> Perfil -> Upload Docs -> Espera Aprovação.
2. **Cliente:** Cadastra -> Busca Diarista -> Solicita Serviço -> Aguarda Aceite -> Paga via Stripe.
3. **Admin:** Gerencia usuários -> Aprova Diaristas -> Monitora Financeiro -> Marca Repasses.

---
**Autor:** [Gabriel Amaral](https://instagram.com/sougabrielamaral)
**Data/Hora:** 10/01/2026 - 19:40
