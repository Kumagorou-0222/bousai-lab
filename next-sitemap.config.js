/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://bousai-lab.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  transform: async (config, path) => {
    // トップページ
    if (path === '/') {
      return { loc: path, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() }
    }
    // カテゴリページ
    if (path.startsWith('/category/')) {
      return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() }
    }
    // 記事ページ
    if (path.startsWith('/articles/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() }
    }
    // 武蔵野市ページ
    if (path.startsWith('/musashino-bousai')) {
      return { loc: path, changefreq: 'weekly', priority: 0.85, lastmod: new Date().toISOString() }
    }
    // チェックリスト
    if (path.startsWith('/checklist')) {
      return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() }
    }
    // その他
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() }
  },
}
