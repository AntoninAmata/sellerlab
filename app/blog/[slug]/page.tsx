import type { Metadata } from 'next'
import { posts, getPost } from '@/lib/blog'
import ArticleContent from './ArticleContent'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Article — SellerLab AI Blog' }
  return {
    title: `${post.fr.title} — SellerLab AI Blog`,
    description: post.fr.metaDescription,
    openGraph: {
      title: post.fr.title,
      description: post.fr.metaDescription,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ArticleContent slug={slug} />
}
