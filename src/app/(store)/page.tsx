export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Layers3, MessageCircle, PackageCheck } from 'lucide-react'
import { cms } from '@/lib/payload'
import { demoImages, lookbook } from '@/lib/demo-images'
import ProductCard from '@/components/ProductCard'

export default async function Home() {
  const hasDatabase = !!(process.env.PAYLOAD_SECRET && (process.env.DATABASE_URI || process.env.DATABASE_URL))
  const docs = hasDatabase ? await (async () => { try { return (await (await cms()).find({ collection: 'products', where: { status: { equals: 'published' } }, sort: '-createdAt', limit: 8, depth: 2 })).docs } catch (error) { console.error('Homepage catalog unavailable', error); return [] } })() : []
  return <main>
    <section className="hero">
      <img className="hero-photo" src={demoImages.hero} alt="Editorial inspiration showing an elegant unstitched outfit" />
      <div className="hero-content">
        <p className="eyebrow">EK COLLECTION · THE UNSTITCHED EDIT</p>
        <h1 className="hero-title">Elegance in<br/><em>Every Stitch.</em></h1>
        <p className="hero-subtitle">Timeless fabrics, thoughtful details and pieces that become uniquely yours. Explore a modern edit of Pakistani unstitched fashion.</p>
        <div className="hero-buttons">
          <Link className="btn btn-ivory" href="/shop">EXPLORE THE COLLECTION <ArrowRight size={16}/></Link>
          <Link className="btn btn-outline" href="#fabrics">DISCOVER FABRICS</Link>
        </div>
      </div>
      <div className="hero-bottom">EDITORIAL IMAGERY · COLLECTION PREVIEW</div>
    </section>

    <section className="section page-width" id="fabrics">
      <div className="editorial-copy">
        <span className="eyebrow">THOUGHTFULLY CURATED</span>
        <h2 className="section-heading">Find your fabric, find your style.</h2>
        <p className="section-lead">The lightness of lawn, the comfort of cotton, the texture of linen. Discover the fabrics at the heart of every wardrobe.</p>
      </div>
      <div className="collection-grid">
        {lookbook.map(collection => <Link href={collection.url} className="collection-tile" key={collection.title}>
          <img src={collection.image} alt={collection.title + ' collection editorial inspiration'} loading="lazy"/>
          <div className="collection-overlay"><small>{collection.subtitle}</small><strong>{collection.title}</strong><span>EXPLORE COLLECTION <ArrowRight size={15}/></span></div>
        </Link>)}
      </div>
      <p className="demo-note">Editorial images are for design preview; actual products and imagery will be added through the store dashboard.</p>
    </section>

    <section className="section featured-section">
      <div className="page-width">
        <div className="heading-row"><div><span className="eyebrow">THE EK EDIT</span><h2 className="section-heading">Our Latest Pieces</h2></div><Link href="/shop" className="text-link">VIEW ALL PRODUCTS <ArrowRight size={15}/></Link></div>
        {docs.length ? <div className="product-grid">{docs.map(product => <ProductCard key={product.id} product={product}/>)}</div> :
          <div className="empty-catalogue"><span className="eyebrow">COMING TO THE COLLECTION</span><h3>Beautiful things are on their way.</h3><p>Our product edit is being prepared. Until the first pieces arrive, explore the styles and textures that inspire us.</p><Link href="/shop" className="btn btn-outline">EXPLORE THE LOOKBOOK <ArrowRight size={16}/></Link></div>}
      </div>
    </section>

    <section className="section page-width">
      <div className="heading-row"><div><span className="eyebrow">A CLOSER LOOK</span><h2 className="section-heading">Made for your own expression.</h2></div><Link className="text-link" href="/shop?style=embroidered">VIEW EMBROIDERED EDIT <ArrowRight size={15}/></Link></div>
      <div className="collection-grid">
        <Link className="collection-tile" href="/shop?style=embroidered"><img src={demoImages.embroidered} alt="Embroidered unstitched clothing inspiration" loading="lazy"/><div className="collection-overlay"><small>THE DETAILED EDIT</small><strong>Embroidered</strong><span>DISCOVER <ArrowRight size={15}/></span></div></Link>
        <Link className="collection-tile" href="/shop?style=printed"><img src={demoImages.printed} alt="Printed unstitched clothing inspiration" loading="lazy"/><div className="collection-overlay"><small>EVERYDAY EXPRESSION</small><strong>Printed</strong><span>DISCOVER <ArrowRight size={15}/></span></div></Link>
        <Link className="collection-tile" href="/shop?style=plain"><img src={demoImages.linen} alt="Plain unstitched fabric inspiration" loading="lazy"/><div className="collection-overlay"><small>BEAUTY IN SIMPLICITY</small><strong>Plain</strong><span>DISCOVER <ArrowRight size={15}/></span></div></Link>
      </div>
    </section>

    <section className="editorial-feature">
      <img className="feature-photo" src={demoImages.cotton} alt="Fabric and outfit inspiration from the EK Collection lookbook" loading="lazy"/>
      <div className="feature-copy"><div className="feature-copy-inner"><p className="eyebrow">THE ART OF UNSTITCHED</p><h2>Unstitched.<br/>Unmistakably <em>yours.</em></h2><span className="hairline"/><p>From soft seasonal textures to graceful embroidered details, the best pieces leave room for personal style. Our focus is simple: thoughtfully chosen unstitched suits for everyday moments and special occasions.</p><Link href="/pages/about" className="text-link">OUR STORY <ArrowRight size={15}/></Link></div></div>
    </section>

    <section className="section page-width"><div className="values">
      <article><Layers3 size={28} strokeWidth={1.3}/><h3>Unstitched Selection</h3><p>Fabric-first pieces you can style and stitch on your own terms.</p></article>
      <article><ShoppingBag size={28} strokeWidth={1.3}/><h3>Simple Ordering</h3><p>Clear products, a straightforward cart and manual payment confirmation.</p></article>
      <article><MessageCircle size={28} strokeWidth={1.3}/><h3>Here to Help</h3><p>Need product or delivery information? Reach our team through the contact page.</p></article>
    </div></section>
  </main>
}
