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
}
