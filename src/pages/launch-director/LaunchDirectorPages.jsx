import { ChapterMarketplaceProducts, ChapterMarketplaceServices, ChapterMarketplaceVendors } from '../shared/ChapterMarketplaceComponents'

export function LaunchDirectorProductsPage() {
  return <ChapterMarketplaceProducts title="Products Monitoring" description="Chapter-wide view of products offered by approved vendors in your assigned chapter." />
}

export function LaunchDirectorServicesPage() {
  return <ChapterMarketplaceServices title="Services Monitoring" description="Chapter-wide view of services offered by approved vendors in your assigned chapter." />
}

export function LaunchDirectorVendorsPage() {
  return <ChapterMarketplaceVendors title="Vendors Monitoring" description="Browse directory of approved marketplace vendors in your chapter." />
}
