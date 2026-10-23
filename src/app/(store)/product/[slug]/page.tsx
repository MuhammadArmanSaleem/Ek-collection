export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { cms } from '@/lib/payload'
import AddToCart from '@/components/AddToCart'
import ProductGallery from '@/components/ProductGallery'
import ProductCard from '@/components/ProductCard'

export default async function Product({ params }: {params: Promise<{ slug: string }>}) {
  const { slug } = await params
  if (!process.env.PAYLOAD_SECRET || !(process.env.DATABASE_URI || process.env.DATABASE_URL)) notFound()
  const payload = await cms()
  const { docs } = await payload.find({ collection:'products', where:{ and:[{slug:{equals:slug}},{status:{equals:'published'}}] }, limit:1, depth:2 })
  const item = docs[0]
  if (!item) notFound()
  const images: { url: string; alt: string }[] = (Array.isArray(item.images) ? item.images : []).flatMap((row: any) => { const image = row?.image; return image && typeof image === 'object' && typeof image.url === 'string' ? [{ url: image.url, alt: typeof image.alt === 'string' ? image.alt : String(item.name) }] : [] })
  const related = (await payload.find({collection:'products', where:{and:[{status:{equals:'published'}},{fabric:{equals:item.fabric}}]}, limit:5, depth:2})).docs.filter((p: any)=>p.id !== item.id).slice(0,4)
  return <main className="page-width detail-page">
    <nav className="breadcrumb"><Link href="/">Home</Link> / <Link href="/shop">The collection</Link> / <Link href={'/shop?fabric='+item.fabric}>{item.fabric}</Link> / {item.name}</nav>
    <div className="detail-grid">
      <ProductGallery images={images} title={item.name}/>
      <div className="detail-content"><span className="eyebrow">EK COLLECTION · {item.fabric} EDIT</span><h1>{item.name}</h1><div className="detail-price">PKR {Number(item.price).toLocaleString('en-PK')}</div><p className="detail-description">{item.description || 'An elegant unstitched piece from the EK Collection.'}</p>
        <div className="detail-divider"/>
        <dl className="spec-list"><div><dt>Fabric</dt><dd>{item.fabric}</dd></div><div><dt>Design</dt><dd>{item.style}</dd></div><div><dt>Pieces</dt><dd>{item.pieces || 3}-piece unstitched</dd></div><div><dt>Availability</dt><dd className={'stock-indicator'+(item.stock>0?'':' sold')}>{item.stock>0?'IN STOCK':'OUT OF STOCK'}</dd></div></dl>
        <div className="detail-divider"/>
        <AddToCart item={{id:item.id,name:item.name,price:Number(item.price),slug:item.slug,image:images[0]?.url}} disabled={item.stock<1}/>
        <p className="detail-note">This item is unstitched and supplied as fabric. Stitching and tailoring services are not included. Actual shades may vary slightly due to lighting and screen settings. Delivery charges are confirmed before dispatch.</p>
        <div className="detail-divider"/><Link className="text-link" href="/pages/return-refund-policy">RETURNS & REFUNDS <ArrowRight size={15}/></Link>
      </div>
    </div>
    {related.length>0 && <section className="section" style={{paddingBottom:0}}><div className="related-heading"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>Explore similar pieces</h2></div><Link className="text-link" href={'/shop?fabric='+item.fabric}>VIEW THE EDIT <ArrowRight size={15}/></Link></div><div className="product-grid">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
  </main>
}
