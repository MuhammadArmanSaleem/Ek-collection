import {notFound} from 'next/navigation'
import {policies} from '@/lib/catalog'
export function generateStaticParams(){return Object.keys(policies).map(slug=>({slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const policy=policies[slug];if(!policy)notFound();return <main className="container legal"><h1>{policy.title}</h1>{policy.body.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</main>}