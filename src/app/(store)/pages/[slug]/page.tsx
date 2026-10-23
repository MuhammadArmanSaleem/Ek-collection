export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, MessageCircle, Mail } from 'lucide-react'
import { cms } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { demoImages } from '@/lib/demo-images'

const defaults: Record<string, { title: string; intro: string; sections: { heading: string; text: string }[] }> = {
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    intro: 'These terms describe how purchases and order confirmations work at EK Collection.',
    sections: [
      {heading:'Products', text:'EK Collection sells unstitched fabric pieces. Stitching, alterations and tailoring services are not included. Descriptions and product availability may be updated.'},
      {heading:'Pricing and ordering', text:'Displayed product prices are in Pakistani Rupees. We verify product availability and order details before dispatch. An order reference confirms receipt of your request, not final dispatch.'},
      {heading:'Payments', text:'Cash on Delivery is available subject to order and delivery confirmation. No online card payment is collected through this website.'},
      {heading:'Delivery', text:'Delivery fees and estimated timeframes will be communicated before dispatch. Delivery estimates can change because of courier conditions or destination.'},
      {heading:'Colors and availability', text:'Actual fabric shades may vary slightly between photographs and devices. If an item becomes unavailable, EK Collection will contact you about next steps.'},
      {heading:'Support', text:'For questions about an order, use the contact options on our Contact page and include your order reference.'},
    ],
  },
  'return-refund-policy': {
    title: 'Returns & Refunds',
    intro: 'Please review the following conditions carefully before ordering unstitched fabrics.',
    sections: [
      {heading:'Eligible concerns', text:'Please report an incorrect, damaged or defective item within 7 days of delivery. Include your order reference and clear photographs so the issue can be reviewed.'},
      {heading:'Item condition', text:'Returned goods must be unused and in their original packaging. Fabric that has been cut, stitched or altered is not eligible for return.'},
      {heading:'Non-returnable purchases', text:'Change-of-mind returns are not accepted. Sale items are non-returnable except where an applicable law requires otherwise.'},
      {heading:'Refunds and exchanges', text:'Approved refunds are processed after the returned item has been inspected. Exchanges depend on stock availability. Any applicable delivery charges will be confirmed as part of the resolution.'},
      {heading:'How to request support', text:'Contact EK Collection through its official contact channels within the eligible period and provide your order reference and item details.'},
    ],
  },
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params
  const configured = !!(process.env.PAYLOAD_SECRET && (process.env.DATABASE_URI || process.env.DATABASE_URL))
  const docs = configured ? (await (await cms()).find({collection:'pages',where:{slug:{equals:slug}},limit:1,depth:1})).docs : []
  const page = docs[0]
  if (page) return <main className="page-width policy-page"><p className="eyebrow">EK COLLECTION / INFORMATION</p><h1>{page.title}</h1>{page.content ? <RichText data={page.content}/> : null}</main>

  if (slug === 'about') return <main><section className="page-width policy-page"><p className="eyebrow">OUR STORY</p><h1>Thoughtfully unstitched.<br/>Effortlessly yours.</h1><p className="policy-intro">EK Collection is a boutique destination for Pakistani unstitched clothing: lawn, cotton and linen, with embroidered and printed expressions for the moments that matter.</p></section><section className="editorial-feature"><img className="feature-photo" src={demoImages.lawn} alt="Fashion editorial inspiration from EK Collection"/><div className="feature-copy"><div className="feature-copy-inner"><p className="eyebrow">THE EK COLLECTION EDIT</p><h2>Fabric first.<br/>Style always.</h2><span className="hairline"/><p>We believe beautiful unstitched clothing starts with fabrics, color and detail. Find an edit to inspire your personal wardrobe, from everyday pieces to elevated occasion looks.</p><Link href="/shop" className="text-link">EXPLORE THE COLLECTION <ArrowUpRight size={15}/></Link></div></div></section></main>

  if (slug === 'contact') {
    const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g,'')
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL
    return <main className="page-width policy-page"><p className="eyebrow">GET IN TOUCH</p><h1>We're here to help.</h1><p className="policy-intro">For product availability, fabric details or questions about an existing order, please reach EK Collection through an official contact channel.</p><div className="contact-options"><div className="contact-option"><MessageCircle size={26} color="#a27f3b"/><h3>WhatsApp</h3><p>Ask about products, delivery and order details.</p>{whatsapp ? <a className="text-link" href={'https://wa.me/'+whatsapp} target="_blank" rel="noopener noreferrer">OPEN WHATSAPP <ArrowUpRight size={15}/></a> : <p>Contact number will be published soon.</p>}</div><div className="contact-option"><Mail size={26} color="#a27f3b"/><h3>Email</h3><p>For general support and order questions.</p>{email ? <a className="text-link" href={'mailto:'+email}>EMAIL OUR TEAM <ArrowUpRight size={15}/></a> : <p>Contact email will be published soon.</p>}</div></div><p>No in-store tailoring or custom stitching services are offered through this website.</p></main>
  }
  const policy=defaults[slug]
  if(!policy) notFound()
  return <main className="page-width policy-page"><p className="eyebrow">EK COLLECTION / INFORMATION</p><h1>{policy.title}</h1><p className="policy-intro">{policy.intro}</p><span className="hairline"/>{policy.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<p style={{marginTop:40}}>Need help? <Link href="/pages/contact" className="text-link">CONTACT US <ArrowUpRight size={15}/></Link></p></main>
}
