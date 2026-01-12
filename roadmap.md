# Dona Diarista - Roadmap de Desenvolvimento

Plano de execução para o MVP do marketplace Dona Diarista.

## Fase 1: Setup & Arquitetura (Atual)
- [ ] Inicialização do projeto Next.js com TypeScript e Tailwind CSS.
- [ ] Configuração do Supabase (Auth, DB, Storage).
- [ ] Estruturação de pastas seguindo o padrão sugerido (`/app/(public)`, `/app/(auth)`, etc).
- [ ] Configuração de SEO básico e acessibilidade.

## Fase 2: Banco de Dados & Segurança
- [ ] Criação do schema do banco de dados (tabelas Profiles, Diarista Profile, Orders, etc).
- [ ] Implementação de RLS (Row Level Security) para todas as tabelas.
- [ ] Scripts de migração e seeds para ambiente de teste.

## Fase 3: Autenticação & Perfis
- [ ] Fluxo de Cadastro/Login para Clientes e Diaristas.
- [ ] Gerenciamento de Perfil da Diarista (Bio, Preço, Documentos).
- [ ] Upload de documentos para o Supabase Storage.

## Fase 4: Fluxos do Marketplace
- [ ] Gestão de Slots de Disponibilidade pelas Diaristas.
- [ ] Busca e Matching de Diaristas por Cidade/UF.
- [ ] Criação de Pedidos e Fluxo de Solicitação (Status SOLICITADO).

## Fase 5: Pagamentos & Integração Stripe
- [ ] Integração com Stripe Checkout.
- [ ] Implementação de Webhooks para confirmação de pagamento.
- [ ] Fluxo de atualização de pedido para PAGO.

## Fase 6: Admin Backoffice
- [ ] Dashboard com KPIs.
- [ ] Gestão de Usuários (Banimento/Desbanimento).
- [ ] Verificação de Diaristas (Aprovação de documentos).
- [ ] Controle de Repasse Manual.

## Fase 7: Refinamento & Entrega
- [ ] Otimização de Performance (Core Web Vitals).
- [ ] Testes manuais e validação do fluxo completo (Happy Path).
- [ ] Documentação final e README.

---
**Autor:** [Gabriel Amaral](https://instagram.com/sougabrielamaral)
**Data/Hora:** 10/01/2026 - 19:20
