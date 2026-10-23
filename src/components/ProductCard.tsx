import Link from 'next/link'
export type ShopProduct = {
  id: string | number; name: string; slug: string; price: number; fabric?: string | null; style?: string | null;
  stock?: number | null; images?: { image?: { url?: string | null; alt?: string | null } | string | number | null }[] | null;
}
export function getProductImage(product: ShopProduct): string | undefined {
  const image = product.images?.[0]?.image
  return typeof image === 'object' && image !== null && image.url ? image.url : undefined
}
export default function ProductCard({ product }: { product: any }) {
  const image = getProductImage(product)
  return <article className="product-card"><Link href={'/product/' + product.slug} className="product-media">
    {image ? <img src={image} alt={product.name} loading="lazy"/> : <div className="product-image-fallback"><span>EK</span><small>Product photo coming soon</small></div>}
    <span className="product-tag">UNSTITCHED · 3 PIECE</span>
    <span className="product-view">VIEW DETAILS ↗</span>
  </Link>
  <div className="product-meta"><span>{product.fabric || 'Unstitched'} {product.style ? '· ' + product.style : ''}</span>{product.stock === 0 && <span>Sold out</span>}</div>
  <Link className="product-title" href={'/product/' + product.slug}>{product.name}</Link>
  <div className="product-price">PKR {Number(product.price).toLocaleString('en-PK')}</div>
  </article>
}
