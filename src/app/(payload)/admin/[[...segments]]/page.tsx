import config from '@payload-config'
import { RootPage } from '@payloadcms/next/views'
export default function Page({ params, searchParams }: any) { return <RootPage config={config} params={params} searchParams={searchParams} /> }
