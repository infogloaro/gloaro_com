import { ChapterMarketplaceProducts, ChapterMarketplaceServices, ChapterMarketplaceVendors } from '../shared/ChapterMarketplaceComponents'

export function ChapterDirectorProductsPage() {
  return <ChapterMarketplaceProducts title="Products Monitoring" description="Chapter-wide view of products offered by approved vendors in your assigned chapter." />
}

export function ChapterDirectorServicesPage() {
  return <ChapterMarketplaceServices title="Services Monitoring" description="Chapter-wide view of services offered by approved vendors in your assigned chapter." />
}

export function ChapterDirectorVendorsPage() {
  return <ChapterMarketplaceVendors title="Vendors Directory" description="Browse directory of approved marketplace vendors in your assigned chapter." />
}
