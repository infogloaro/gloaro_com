import { ChapterMarketplaceProducts, ChapterMarketplaceServices, ChapterMarketplaceVendors } from '../shared/ChapterMarketplaceComponents'

export function VicePresidentProductsPage() {
  return <ChapterMarketplaceProducts title="Products Monitoring" description="Chapter-wide view of products offered by approved vendors in your assigned chapter." />
}

export function VicePresidentServicesPage() {
  return <ChapterMarketplaceServices title="Services Monitoring" description="Chapter-wide view of services offered by approved vendors in your assigned chapter." />
}

export function VicePresidentVendorsPage() {
  return <ChapterMarketplaceVendors title="Vendors Monitoring" description="Browse directory of approved marketplace vendors in your chapter." />
}
