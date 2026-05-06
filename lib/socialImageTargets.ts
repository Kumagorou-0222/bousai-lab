import { getAllArticlesMeta } from './articles'

export function getSocialImageTargets() {
  return getAllArticlesMeta().map((article) => ({
    slug: article.slug,
    title: article.title,
    manga: article.manga,
  }))
}
