'use client'
import { useState } from 'react'
export default function ProductGallery({ images, title }: { images: { url: string; alt?: string }[]; title: string }) {
  const [active, setActive] = useState(0)
  if (!images.length) return <div className="detail-image product-image-fallback"><span>EK</span><small>Product photography coming soon</small></div>
  return <div><div className="detail-image"><img src={images[active]?.url || images[0].url} alt={images[active]?.alt || title}/></div>{images.length > 1 && <div className="detail-thumbs">{images.map((image,index)=><button type="button" key={index} className={'thumb-button'+(active===index?' selected':'')} aria-label={'View image '+(index+1)} aria-pressed={active===index} onClick={()=>setActive(index)}><img src={image.url} alt={image.alt || title}/></button>)}</div>}</div>
}
