import { NextResponse } from 'next/server'
import { cms } from '@/lib/payload'

const methods = ['cod', 'bank', 'jazzcash', 'easypaisa'] as const
function stringField(value: unknown, max: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid order' }, { status: 400 })
    const data = body as Record<string, unknown>
    if (!Array.isArray(data.items) || data.items.length < 1 || data.items.length > 30)
      return NextResponse.json({ error: 'Invalid shopping bag' }, { status: 400 })
    const customerName = stringField(data.customerName, 120)
    const phone = stringField(data.phone, 30)
    const address = stringField(data.address, 500)
    const city = stringField(data.city, 100)
    const email = typeof data.email === 'string' && data.email.trim() ? data.email.trim() : undefined
    const paymentMethod = data.paymentMethod
    if (!customerName || !phone || !address || !city || !methods.includes(paymentMethod as typeof methods[number]) || (email && (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254)))
      return NextResponse.json({ error: 'Please check your contact and delivery details' }, { status: 400 })
    const payload = await cms()
    const items: { product: number | string; nameSnapshot: string; priceSnapshot: number; quantity: number }[] = []
    const seen = new Set<string>()
    let subtotal = 0
    for (const row of data.items) {
      if (!row || typeof row !== 'object') return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
      const item = row as Record<string, unknown>
      const id = item.id
      const quantity = item.quantity
      if (!(typeof id === 'string' || typeof id === 'number') || !Number.isSafeInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 20 || seen.has(String(id)))
        return NextResponse.json({ error: 'Invalid item quantity' }, { status: 400 })
      seen.add(String(id))
      const product = await payload.findByID({ collection: 'products', id, depth: 0 })
      if (product.status !== 'published' || product.stock < (quantity as number))
        return NextResponse.json({ error: 'One or more items are unavailable. Please update your bag.' }, { status: 409 })
      const price = Number(product.price)
      if (!Number.isFinite(price) || price < 0) return NextResponse.json({ error: 'Invalid product price' }, { status: 409 })
      items.push({ product: product.id, nameSnapshot: product.name, priceSnapshot: price, quantity: quantity as number })
      subtotal += price * (quantity as number)
    }
    if (!Number.isFinite(subtotal)) return NextResponse.json({ error: 'Invalid order total' }, { status: 400 })
    const reference = 'EK-' + crypto.randomUUID().slice(0, 12).toUpperCase()
    await payload.create({
      collection: 'orders',
      data: {
        reference, customerName, phone, address, city, email,
        paymentMethod: paymentMethod as typeof methods[number],
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'pending_verification',
        status: 'pending', items, subtotal, shipping: 0, total: subtotal,
      },
    })
    return NextResponse.json({ reference })
  } catch (error) {
    console.error('Checkout error', error)
    return NextResponse.json({ error: 'We could not place your order. Please try again.' }, { status: 500 })
  }
}
