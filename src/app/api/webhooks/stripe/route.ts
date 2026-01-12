import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase-server'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = await createClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any
        const orderId = session.metadata.order_id

        // Update order status
        await supabase
            .from('orders')
            .update({ status: 'PAGO' })
            .eq('id', orderId)

        // Log payment
        await supabase
            .from('payments')
            .insert({
                order_id: orderId,
                stripe_session_id: session.id,
                amount: session.amount_total / 100,
                status: 'CONFIRMADO',
            })
    }

    return NextResponse.json({ received: true })
}
