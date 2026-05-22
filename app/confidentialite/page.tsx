import type { Metadata } from 'next'
import ConfidentialiteContent from './ConfidentialiteContent'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — SellerLab AI',
  description: 'Politique de confidentialité et traitement des données personnelles de SellerLab AI.',
  robots: { index: false, follow: false },
}

export default function ConfidentialitePage() {
  return <ConfidentialiteContent />
}
