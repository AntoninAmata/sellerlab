import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'À propos — SellerLab AI',
  description: 'Découvrez l\'histoire et la mission de SellerLab AI, l\'outil IA pour les vendeurs Vinted.',
}

export default function AboutPage() {
  return <AboutContent />
}
