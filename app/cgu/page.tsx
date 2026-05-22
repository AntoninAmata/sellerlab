import type { Metadata } from 'next'
import CguContent from './CguContent'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation — SellerLab AI',
  description: 'Conditions générales d\'utilisation du service SellerLab AI.',
  robots: { index: false, follow: false },
}

export default function CguPage() {
  return <CguContent />
}
