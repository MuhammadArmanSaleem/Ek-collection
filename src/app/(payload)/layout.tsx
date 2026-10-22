import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout config={config} importMap={importMap}>{children}</RootLayout>
}
