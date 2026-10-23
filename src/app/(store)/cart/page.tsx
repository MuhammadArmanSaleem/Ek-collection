'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'
import { readCart, saveCart, type CartItem } from '@/components/AddToCart'
export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([])
  useEffect(() => {
    const refresh = () => setItems(readCart())
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [])
  function update(id: CartItem['id'], quantity: number) {
    const next = items.map(item => String(item.id) === String(id) ? {...item, quantity: Math.max(0, Math.min(20, quantity))} : item).filter(item => item.quantity > 0)
    setItems(next)
    saveCart(next)
  }
  const subtotal = items.reduce((sum,item) => sum + item.price * item.quantity, 0)
  return <main className="page-width cart-page">
    <p className="eyebrow">YOUR SELECTION</p><h1 className="page-title">Your Shopping Bag</h1><p className="page-intro">Your carefully chosen pieces, all in one place. Review the details before checkout.</p>
    {!items.length ? <div className="empty-state"><ShoppingBag size={42} strokeWidth={1.2}/><h2>Your bag is waiting.</h2><p>There's nothing here yet. Explore our unstitched edits and find something you'll love.</p><Link className="btn btn-dark" href="/shop">DISCOVER THE COLLECTION <ArrowRight size={15}/></Link></div> :
    <div className="cart-layout"><div className="cart-items">
      {items.map(item => <article key={item.id} className="cart-row">
        <Link href={'/product/'+item.slug} aria-label={'View '+item.name}>{item.image ? <img src={item.image} alt={item.name}/> : <span className="cart-no-image">EK</span>}</Link>
        <div><p className="cart-sku">EK COLLECTION · UNSTITCHED</p><Link href={'/product/'+item.slug}><h3>{item.name}</h3></Link><p className="cart-sku">PKR {item.price.toLocaleString('en-PK')} each</p><div className="quantity-picker"><button aria-label={'Remove one '+item.name} onClick={()=>update(item.id,item.quantity-1)}>−</button><span>{item.quantity}</span><button aria-label={'Add one '+item.name} disabled={item.quantity>=20} onClick={()=>update(item.id,item.quantity+1)}>+</button></div><button className="remove-button" onClick={()=>update(item.id,0)}><Trash2 size={12} style={{display:'inline',marginRight:5}}/>Remove</button></div>
        <div className="cart-row-price">PKR {(item.price*item.quantity).toLocaleString('en-PK')}</div>
      </article>)}
      <div style={{marginTop:25}}><Link href="/shop" className="text-link">← CONTINUE SHOPPING</Link></div>
    </div>
    <aside className="summary-card"><h2>Order Summary</h2><div className="summary-line"><span>Items ({items.reduce((n,x)=>n+x.quantity,0)})</span><strong>PKR {subtotal.toLocaleString('en-PK')}</strong></div><div className="summary-line"><span>Delivery</span><span>Confirmed by EK Collection</span></div><div className="summary-line summary-total"><span>Estimated subtotal</span><span>PKR {subtotal.toLocaleString('en-PK')}</span></div><p className="summary-note">Product availability and pricing are verified during checkout. Delivery charges will be confirmed before dispatch.</p><Link href="/checkout" className="btn btn-dark">PROCEED TO CHECKOUT <ArrowRight size={15}/></Link></aside>
    </div>}
  </main>
}
