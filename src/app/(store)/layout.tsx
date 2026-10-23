import '../globals.css'
import type { Metadata } from 'next'
import StoreHeader from '@/components/StoreHeader'
import StoreFooter from '@/components/StoreFooter'
export const metadata: Metadata = {
  title: { default: 'EK Collection | Unstitched Suits', template: '%s | EK Collection' },
  description: 'Explore thoughtfully curated unstitched Pakistani three-piece suits in lawn, cotton and linen.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><StoreHeader/>{children}<StoreFooter/></body></html>
}
