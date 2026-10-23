import Link from 'next/link'
import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react'

export default function StoreFooter() {
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g,'')
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  return <footer className="site-footer"><div className="footer-grid">
    <div className="footer-brand"><div className="footer-monogram">EK<span>COLLECTION</span></div><p>Modern Pakistani elegance, thoughtfully curated in unstitched fabrics. Discover pieces to make your own.</p>{whatsapp && <a className="footer-contact" href={'https://wa.me/' + whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/> Chat on WhatsApp <ArrowUpRight size={15}/></a>}</div>
    <div><h4>Explore</h4><Link href="/shop">Shop all</Link><Link href="/shop?fabric=lawn">Lawn</Link><Link href="/shop?fabric=cotton">Cotton</Link><Link href="/shop?fabric=linen">Linen</Link><Link href="/shop?style=embroidered">Embroidered</Link></div>
    <div><h4>Information</h4><Link href="/pages/about">About EK Collection</Link><Link href="/pages/contact">Contact</Link><Link href="/pages/terms-and-conditions">Terms & Conditions</Link><Link href="/pages/return-refund-policy">Returns & Refunds</Link></div>
    <div><h4>Let's connect</h4><p>Questions about an item, fabric or an existing order? We're here to help.</p>{email && <a href={'mailto:' + email}>{email}</a>}{whatsapp && <a href={'https://wa.me/' + whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp support ↗</a>}</div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} EK COLLECTION</span><span>MADE FOR EVERYDAY ELEGANCE</span></div></footer>
}
