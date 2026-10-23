import config from '@payload-config'
import { RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export default function Page({ params, searchParams }: { params: Promise<{ segments: string[] }>; searchParams: Promise<Record<string, string | string[]>> }) {
  return <RootPage config={config} importMap={importMap} params={params} searchParams={searchParams} />
}
