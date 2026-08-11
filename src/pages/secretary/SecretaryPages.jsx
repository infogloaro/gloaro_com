import { ChapterMarketplaceProducts, ChapterMarketplaceServices, ChapterMarketplaceVendors } from '../shared/ChapterMarketplaceComponents'

export function SecretaryProductsPage() {
  return <ChapterMarketplaceProducts title="Products Monitoring" description="Unit-wide view of products offered by approved vendors in your assigned unit." />
}

export function SecretaryServicesPage() {
  return <ChapterMarketplaceServices showStatus={false} title="Services Monitoring" description="Unit-wide view of services offered by approved vendors in your assigned unit." />
}

export function SecretaryVendorsPage() {
  return <ChapterMarketplaceVendors showStatus={false} title="Vendors Monitoring" description="Browse directory of approved marketplace vendors in your chapter." />
}
