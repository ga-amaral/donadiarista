import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase-server'
import { stripe } from '@/utils/stripe'

export async function POST(req: Request) {
    try {
        const { orderId } = await req.json()
        const supabase = await createClient()

        // 1. Get order details
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        *,
        cliente:cliente_id (email, name),
        diarista:diarista_id (name),
        diarista_pricing(daily_price)
      `)
            .eq('id', orderId)
            .single()

        if (error || !order) {
            return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
        }

        if (order.status !== 'ACEITO_AGUARDANDO_PAGAMENTO') {
            return NextResponse.json({ error: 'Pedido não está aguardando pagamento' }, { status: 400 })
        }

        // 2. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Serviço de Limpeza - ${order.diarista.name}`,
                            description: `Data: ${new Date(order.start_at).toLocaleDateString()}`,
                        },
                        unit_amount: Math.round(order.diarista_pricing[0].daily_price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cliente/pedidos?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cliente/pedidos?canceled=true`,
            metadata: {
                order_id: order.id,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
