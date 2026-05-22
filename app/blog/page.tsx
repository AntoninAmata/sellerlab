import type { Metadata } from 'next'
import BlogContent from './BlogContent'

export const metadata: Metadata = {
  title: 'Blog — SellerLab AI',
  description:
    "Conseils pour vendre mieux sur Vinted : prix, photos, annonces. Découvrez les stratégies des vendeurs qui réussissent.",
}

export default function BlogPage() {
  return <BlogContent />
}
