'use client'
import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
export type CartItem = {id: string|number; name: string; price: number; slug: string; quantity: number; image?: string}
export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(localStorage.getItem('ek-cart') || '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item) => item && (typeof item.id === 'string' || typeof item.id === 'number') && typeof item.price === 'number' && Number.isFinite(item.price) && Number.isSafeInteger(item.quantity) && item.quantity > 0 && typeof item.name === 'string' && typeof item.slug === 'string').slice(0, 30)
  } catch { return [] }
}
export function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('ek-cart', JSON.stringify(items))
  window.dispatchEvent(new Event('ek-cart-updated'))
}
export default function AddToCart({item,disabled}:{item:Omit<CartItem,'quantity'>;disabled:boolean}) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  function add() {
    const cart = readCart()
    const found = cart.find(x => String(x.id) === String(item.id))
    if (found) found.quantity = Math.min(20, found.quantity + quantity)
    else cart.push({...item, quantity})
    saveCart(cart)
    setAdded(true)
  }
  return <div className="purchase-actions"><div className="quantity-picker"><button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(Math.max(1,quantity-1))}>−</button><span aria-live="polite">{quantity}</span><button type="button" aria-label="Increase quantity" disabled={quantity >= 20} onClick={() => setQuantity(Math.min(20,quantity+1))}>+</button></div><button type="button" className="btn btn-dark purchase-button" onClick={add} disabled={disabled}>{disabled ? 'OUT OF STOCK' : added ? <><Check size={17}/> ADDED TO BAG</> : <><ShoppingBag size={17}/> ADD TO BAG</>}</button></div>
}
