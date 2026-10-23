export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { cms } from '@/lib/payload'
import ProductCard from '@/components/ProductCard'
import { lookbook } from '@/lib/demo-images'

type ShopQuery = { fabric?: string; style?: string; q?: string; page?: string }
const fabrics = ['lawn','cotton','linen']
const styles = ['embroidered','printed','plain']
export default async function Shop({ searchParams }: { searchParams: Promise<ShopQuery> }) {
  const raw = await searchParams
  const fabric = fabrics.includes(raw.fabric || '') ? raw.fabric : undefined
  const style = styles.includes(raw.style || '') ? raw.style : undefined
  const q = typeof raw.q === 'string' ? raw.q.trim().slice(0, 80) : ''
  const page = Math.max(1, Math.min(200, Number.parseInt(raw.page || '1', 10) || 1))
  const configured = !!(process.env.PAYLOAD_SECRET && (process.env.DATABASE_URI || process.env.DATABASE_URL))
  const conditions: any[] = [{ status: { equals: 'published' } }]
  if (fabric) conditions.push({ fabric: { equals: fabric } })
  if (style) conditions.push({ style: { equals: style } })
  if (q) conditions.push({ name: { contains: q } })
  const result = configured ? await (await cms()).find({
    collection:'products', where:{and:conditions}, limit:12, page, sort:'-createdAt', depth:2,
  }) : { docs: [], totalDocs: 0, totalPages: 1, page: 1 }
  const filters = [
    ['All Suits','/shop',!fabric&&!style],
    ['Lawn','/shop?fabric=lawn',fabric==='lawn'],
    ['Cotton','/shop?fabric=cotton',fabric==='cotton'],
    ['Linen','/shop?fabric=linen',fabric==='linen'],
    ['Embroidered','/shop?style=embroidered',style==='embroidered'],
    ['Printed','/shop?style=printed',style==='printed'],
    ['Plain','/shop?style=plain',style==='plain'],
  ] as const
  const categoryTitle = fabric ? fabric[0].toUpperCase() + fabric.slice(1) : style ? style[0].toUpperCase() + style.slice(1) : 'All Unstitched Suits'
  function pageUrl(value:number) {
    const params = new URLSearchParams()
    if(fabric) params.set('fabric',fabric)
    if(style) params.set('style',style)
    if(q) params.set('q',q)
    params.set('page',String(value))
    return '/shop?' + params.toString()
  }
  return <main>
    <section className="shop-intro page-width"><span className="eyebrow">HOME / THE COLLECTION</span><h1>{categoryTitle}</h1><p>Discover timeless unstitched fabrics, thoughtful colors, and beautifully considered pieces for your own style.</p></section>
    <section className="page-width section" style={{paddingTop:0}}>
      <div className="filter-toolbar">{filters.map(([name,url,active]) => <Link key={name} className={'filter-pill'+(active?' active':'')} href={url}>{name}</Link>)}
        <form className="search-form" action="/shop" method="GET">
          {fabric && <input type="hidden" name="fabric" value={fabric}/>}
          {style && <input type="hidden" name="style" value={style}/>}
          <input name="q" defaultValue={q} aria-label="Search products" placeholder="Search collection..."/><button type="submit" aria-label="Search"><Search size={17}/></button>
        </form>
      </div>
      <div className="listing-info"><span>{result.totalDocs} {result.totalDocs === 1 ? 'piece' : 'pieces'} in this edit</span><span>3-piece unstitched clothing · Prices in PKR</span></div>
      {result.docs.length ? <>
        <div className="product-grid">{result.docs.map(p => <ProductCard key={p.id} product={p}/>)}</div>
        {result.totalPages > 1 && <nav className="pagination" aria-label="Catalog pages">{page > 1 && <Link className="filter-pill" href={pageUrl(page-1)}>← PREVIOUS</Link>}<span className="filter-pill active">PAGE {page} OF {result.totalPages}</span>{page < result.totalPages && <Link className="filter-pill" href={pageUrl(page+1)}>NEXT →</Link>}</nav>}
      </> : <div className="empty-catalogue"><span className="eyebrow">CURATED COLLECTION</span><h3>{q ? 'No matching pieces yet.' : 'The edit is coming together.'}</h3><p>{q ? 'Try searching a different name or browse the fabrics below.' : 'We are preparing our first product listings. In the meantime, explore these fabric moods from the approved editorial design.'}</p><Link className="btn btn-outline" href="/shop">EXPLORE ALL FABRICS <ArrowRight size={15}/></Link>
        <div className="inspiration-grid">{lookbook.map(c => <figure key={c.title}><img src={c.image} alt={c.title+' editorial demo'} loading="lazy"/><figcaption>{c.title} · Demo image</figcaption></figure>)}</div>
        <p className="demo-note">Editorial previews are not available for purchase until real products are published.</p>
      </div>}
    </section>
    <section className="shop-bottom"><div className="page-width"><div><p className="eyebrow">EK COLLECTION</p><h2>Find what feels like you.</h2></div><p>Explore lawn, cotton and linen, or filter by embroidery and printed designs. Actual styles and prices will appear as the store's inventory is published.</p></div></section>
  </main>
}
