'use client'
import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, LockKeyhole } from 'lucide-react'
import { readCart, saveCart, type CartItem } from '@/components/AddToCart'

export default function Checkout() {
  const [items, setItems] = useState<CartItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  useEffect(() => setItems(readCart()), [])
  const subtotal = items.reduce((sum,item) => sum + item.price * item.quantity, 0)
  async function placeOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!items.length || busy) return
    const data = new FormData(e.currentTarget)
    setBusy(true)
    try {
      const response = await fetch('/api/checkout', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          items: items.map(item => ({ id:item.id, quantity:item.quantity })),
          customerName:data.get('name'), phone:data.get('phone'), email:data.get('email'),
          city:data.get('city'), address:data.get('address'), paymentMethod:'cod',
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.reference) throw new Error(result.error || 'We could not place your order.')
      setReference(String(result.reference))
      setItems([])
      saveCart([])
      window.scrollTo({top:0,behavior:'smooth'})
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to place order. Please try again.')
    } finally {setBusy(false)}
  }
  if (reference) return <main className="page-width checkout-page"><div className="checkout-success"><CheckCircle2 size={46} strokeWidth={1.25}/><p className="eyebrow">ORDER REQUEST RECEIVED</p><h1>Thank you for your order.</h1><p>We have saved your order in our system. A member of the EK Collection team will confirm availability, the final delivery charge and your cash-on-delivery details before dispatch.</p><div className="reference">ORDER REFERENCE: {reference}</div><p>Keep this reference for any order-related questions.</p><Link className="btn btn-dark" href="/shop">CONTINUE SHOPPING <ArrowRight size={16}/></Link></div></main>
  return <main className="page-width checkout-page"><p className="eyebrow">THE FINAL STEP</p><h1 className="page-title">Secure Checkout</h1><p className="page-intro">Complete your delivery details below. We will confirm your order and any delivery charges before dispatch.</p>
    {!items.length ? <div className="empty-state"><h2>Your bag is empty.</h2><p>Add an item to your bag before checking out.</p><Link className="btn btn-dark" href="/shop">RETURN TO COLLECTION</Link></div> :
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={placeOrder}>
        <section className="form-section"><h2>01 / Contact details</h2><div className="form-grid"><label className="form-field">Full name *<input name="name" autoComplete="name" required maxLength={120} placeholder="Your full name"/></label><label className="form-field">Phone number *<input name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="03XXXXXXXXX"/></label><label className="form-field full-row">Email address (optional)<input type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@example.com"/></label></div></section>
        <section className="form-section"><h2>02 / Delivery information</h2><div className="form-grid"><label className="form-field">City *<input name="city" required autoComplete="address-level2" maxLength={100} placeholder="City"/></label><label className="form-field full-row">Delivery address *<textarea name="address" required autoComplete="street-address" maxLength={500} placeholder="House or apartment, street, area, city"/></label></div></section>
        <section className="form-section"><h2>03 / Payment</h2><label className="form-field">Payment method<select aria-label="Payment method" defaultValue="cod" disabled><option value="cod">Cash on Delivery</option></select></label><p style={{fontSize:12,color:'var(--muted)',marginBottom:0}}>No card details are collected. Our team will confirm the total and delivery charge before your order is dispatched.</p></section>
        {error && <div role="alert" className="form-error">{error}</div>}
        <button className="btn btn-dark" type="submit" disabled={busy}>{busy?'PLACING ORDER…':'PLACE ORDER REQUEST'} <ArrowRight size={16}/></button>
        <p style={{fontSize:11,color:'var(--muted)'}}>By placing an order, you agree to our <Link href="/pages/terms-and-conditions" style={{textDecoration:'underline'}}>Terms & Conditions</Link> and <Link href="/pages/return-refund-policy" style={{textDecoration:'underline'}}>Return Policy</Link>.</p>
      </form>
      <aside className="summary-card"><h2>Your Order</h2>{items.map(item=><div className="summary-line" key={item.id} style={{alignItems:'center',borderBottom:'1px solid #ddd3c6',paddingBottom:15}}><span>{item.name} <small>× {item.quantity}</small></span><strong>PKR {(item.price*item.quantity).toLocaleString('en-PK')}</strong></div>)}<div className="summary-line" style={{marginTop:20}}><span>Subtotal</span><strong>PKR {subtotal.toLocaleString('en-PK')}</strong></div><div className="summary-line"><span>Shipping</span><span>To be confirmed</span></div><div className="summary-line summary-total"><span>Estimated subtotal</span><strong>PKR {subtotal.toLocaleString('en-PK')}</strong></div><p className="summary-note">Final amount may include delivery charges; no payment is collected online.</p><p style={{fontSize:11,display:'flex',alignItems:'center',gap:8,color:'var(--muted)'}}><LockKeyhole size={15}/> Details used only to process your order.</p></aside>
    </div>}
  </main>
}
