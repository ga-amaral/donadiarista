-- SCRIPT DE SEED: 30 DIARISTAS E 60 CLIENTES
-- Este script popula as tabelas profiles, diarista_profile e diarista_pricing com dados realistas de teste.
-- Localidade padrão: Bauru, SP

DO $$
DECLARE
    new_user_id UUID;
    i INTEGER;
    first_names_f TEXT[] := ARRAY['Maria', 'Ana', 'Beatriz', 'Juliana', 'Carla', 'Fernanda', 'Luciana', 'Patrícia', 'Camila', 'Aline', 'Sandra', 'Regina', 'Sônia', 'Débora', 'Elaine'];
    first_names_m TEXT[] := ARRAY['João', 'José', 'Ricardo', 'Paulo', 'Marcos', 'Fernando', 'Roberto', 'Carlos', 'Gabriel', 'Marcelo', 'André', 'Diego', 'Bruno', 'Luís', 'Eduardo'];
    last_names TEXT[] := ARRAY['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Lopes', 'Soares'];
    bios TEXT[] := ARRAY[
        'Especialista em limpeza pesada e organização de armários.',
        'Diarista com 10 anos de experiência, foco em detalhes.',
        'Limpeza rápida e eficiente para apartamentos pequenos.',
        'Atendimento com capricho e pontualidade sempre.',
        'Especialista em passadoria e limpeza residencial fina.',
        'Faço limpeza pós-obra e faxinas detalhadas.',
        'Disponibilidade imediata, trago meus próprios materiais se necessário.',
        'Foco em organização de ambientes e limpeza geral.',
        'Diarista experiente com referências em toda a cidade.',
        'Limpeza humanizada com produtos ecológicos.'
    ];
BEGIN
    -- 1. GERANDO 30 DIARISTAS
    FOR i IN 1..30 LOOP
        -- Gera um novo UUID para o perfil
        new_user_id := gen_random_uuid();
        
        -- Insere no Perfil (Profiles)
        INSERT INTO public.profiles (id, name, email, role, city, uf)
        VALUES (
            new_user_id,
            first_names_f[1 + (i % 15)] || ' ' || last_names[1 + (i % 16)],
            'diarista' || i || '@test.com',
            'DIARISTA',
            'Bauru',
            'SP'
        );

        -- Insere no Perfil Profissional (Diarista Profile)
        INSERT INTO public.diarista_profile (profile_id, bio, status_verificacao, rating_avg)
        VALUES (
            new_user_id,
            bios[1 + (i % 10)],
            'APROVADA',
            (4 + (random() * 1))::numeric(2,1) -- Avaliação entre 4.0 e 5.0
        );

        -- Insere a Precificação (Diarista Pricing)
        INSERT INTO public.diarista_pricing (profile_id, daily_price)
        VALUES (
            new_user_id,
            (150 + (floor(random() * 10) * 10)) -- Preço entre 150 e 240
        );
    END LOOP;

    -- 2. GERANDO 60 CLIENTES
    FOR i IN 1..60 LOOP
        new_user_id := gen_random_uuid();
        
        -- Insere no Perfil (Profiles)
        INSERT INTO public.profiles (id, name, email, role, city, uf)
        VALUES (
            new_user_id,
            (CASE WHEN i % 2 = 0 THEN first_names_f[1 + (i % 15)] ELSE first_names_m[1 + (i % 15)] END) || ' ' || last_names[1 + (i % 16)],
            'cliente' || i || '@test.com',
            'CLIENTE',
            'Bauru',
            'SP'
        );
    END LOOP;

    RAISE NOTICE 'Seed concluído com sucesso: 30 Diaristas e 60 Clientes inseridos.';
END $$;
