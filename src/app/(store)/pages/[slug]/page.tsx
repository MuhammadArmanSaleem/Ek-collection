export const dynamic = 'force-dynamic'
import {notFound} from 'next/navigation'
import {cms} from '@/lib/payload'
import {RichText} from '@payloadcms/richtext-lexical/react'
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const payload=await cms();const {docs}=await payload.find({collection:'pages',where:{slug:{equals:slug}},limit:1});if(!docs[0])notFound();return <main className="container legal"><h1>{docs[0].title}</h1>{docs[0].content?<RichText data={docs[0].content}/>:null}</main>}