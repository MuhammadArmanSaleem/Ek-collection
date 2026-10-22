import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
export default function Layout({ children }: { children: React.ReactNode }) { return <RootLayout config={config}>{children}</RootLayout> }
