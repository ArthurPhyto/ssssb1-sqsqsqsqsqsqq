import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { createMovieSlug, createCategorySlug } from '@/lib/utils/slug'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratuit-streaming.fr'

  // Récupérer tous les films
  const { data: movies } = await supabase
    .from('movies')
    .select('id, title, release_date')
    .order('release_date', { ascending: false })

  // Récupérer toutes les catégories
  const { data: categories } = await supabase
    .from('categorie')
    .select('name')

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nouveautes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ] as const

  const movieUrls = (movies || []).map((movie) => ({
    url: `${baseUrl}/film/${movie.id}-${createMovieSlug(movie.title)}`,
    lastModified: new Date(movie.release_date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryUrls = (categories || []).map((category) => ({
    url: `${baseUrl}/categorie/${createCategorySlug(category.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...movieUrls, ...categoryUrls]
}