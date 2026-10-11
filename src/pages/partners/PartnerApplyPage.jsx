import { MotionConfig } from 'framer-motion'
import ApplicationForm from '../../components/partners/forms/ApplicationForm'
import BackButton from '../../components/common/BackButton'

// Focused application layout (no site navigation). `key` keeps the Franchise
// and Channel Partner forms fully separate if the visitor switches paths.
export default function PartnerApplyPage({ pathKey }) {
  return (
    <MotionConfig reducedMotion="user">
      <ApplicationForm key={pathKey} pathKey={pathKey} />
      <BackButton />
    </MotionConfig>
  )
}
