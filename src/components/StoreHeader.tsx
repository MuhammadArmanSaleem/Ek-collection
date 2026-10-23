'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, ShoppingBag, Search, ArrowUpRight } from 'lucide-react'
import { readCart } from './AddToCart'

const links = [
  { href: '/shop', title: 'Shop All' },
  { href: '/shop?fabric=lawn', title: 'Lawn' },
  { href: '/shop?fabric=cotton', title: 'Cotton' },
  { href: '/shop?fabric=linen', title: 'Linen' },
  { href: '/shop?style=embroidered', title: 'Embroidered' },
  { href: '/shop?style=printed', title: 'Printed & Plain' },
]
export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bagCount, setBagCount] = useState(0)
  useEffect(() => {
    const update = () => setBagCount(readCart().reduce((total, item) => total + item.quantity, 0))
    update()
    window.addEventListener('storage', update)
    window.addEventListener('ek-cart-updated', update)
    return () => { window.removeEventListener('storage', update); window.removeEventListener('ek-cart-updated', update) }
  }, [])
  return <>
    <div className="announcement">UNSTITCHED FABRICS · THOUGHTFULLY CURATED · PAKISTAN</div>
    <header className="site-header">
      <div className="header-inner">
        <button className="icon-button menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)} aria-label="EK Collection home"><span className="brand-monogram">EK</span><span className="brand-divider" /><span className="brand-copy">EK COLLECTION<small>UNSTITCHED EDIT</small></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          {links.map(link => <Link href={link.href} key={link.href}>{link.title}</Link>)}
        </nav>
        <div className="header-actions"><Link href="/shop" aria-label="Shop collection" className="icon-link"><Search size={20}/></Link><Link href="/cart" aria-label={'Shopping bag, ' + bagCount + ' items'} className="bag-link"><ShoppingBag size={21}/><span className="cart-count">{bagCount}</span></Link></div>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
        <Link href="/" onClick={() => setMenuOpen(false)}>Home <ArrowUpRight size={16}/></Link>
        {links.map(link => <Link href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.title}<ArrowUpRight size={16}/></Link>)}
        <Link href="/pages/contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={16}/></Link>
      </nav>}
    </header>
  </>
}
