import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // A chamada getUser() garante que a sessão seja atualizada/validada
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // URLs que não precisam de autenticação
    const isPublicRoute = pathname === '/' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/cadastro') ||
        pathname.startsWith('/auth')

    // Se não estiver logado e tentar acessar rota protegida
    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Se estiver logado, verificar roles para rotas específicas
    if (user) {
        // Se tentar acessar login/cadastro já estando logado, manda pro dashboard correspondente
        if (pathname.startsWith('/login') || pathname.startsWith('/cadastro')) {
            const role = user.user_metadata?.role
            if (role === 'DIARISTA') return NextResponse.redirect(new URL('/diarista/dashboard', request.url))
            if (role === 'CLIENTE') return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
            if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))

            // Fallback se não tiver role no metadata
            return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
        }

        const isClientRoute = pathname.startsWith('/cliente')
        const isDiaristaRoute = pathname.startsWith('/diarista')
        const isAdminRoute = pathname.startsWith('/admin')

        if (isClientRoute || isDiaristaRoute || isAdminRoute) {
            // Tenta pegar do metadata primeiro (mais rápido e evita problemas de RLS no login)
            const role = user.user_metadata?.role

            if (role) {
                if (isAdminRoute && role !== 'ADMIN') {
                    return NextResponse.redirect(new URL('/', request.url))
                }

                if (isClientRoute && role !== 'CLIENTE') {
                    return NextResponse.redirect(new URL('/diarista/dashboard', request.url))
                }

                if (isDiaristaRoute && role !== 'DIARISTA') {
                    return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
                }
            } else {
                // Fallback para o banco se não tiver no metadata
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    if (isAdminRoute && profile.role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url))
                    if (isClientRoute && profile.role !== 'CLIENTE') return NextResponse.redirect(new URL('/diarista/dashboard', request.url))
                    if (isDiaristaRoute && profile.role !== 'DIARISTA') return NextResponse.redirect(new URL('/cliente/dashboard', request.url))
                }
            }
        }
    }

    return response
}
