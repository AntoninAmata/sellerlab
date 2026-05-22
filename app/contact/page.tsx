import type { Metadata } from 'next'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact — SellerLab AI',
  description: 'Contactez l\'équipe SellerLab AI. Nous répondons sous 24 à 48 heures.',
}

export default function ContactPage() {
  return <ContactContent />
}
