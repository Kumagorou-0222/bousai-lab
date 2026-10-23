import { selectApprovedMetaPosts } from './metaApprovedPosts.ts'
import { publishMetaPost } from './metaPublisher.ts'

type Publish = typeof publishMetaPost

export async function runApprovedMetaPosts(
  manifest: unknown,
  now = new Date(),
  env: NodeJS.ProcessEnv = process.env,
  publish: Publish = publishMetaPost,
) {
  const approved = selectApprovedMetaPosts(manifest, now)
  if (env.META_DRY_RUN !== 'false' || env.SOCIAL_PUBLISH_ENABLED !== 'true') {
    return { status: 'dry_run' as const, approvedCount: approved.length, sentCount: 0 }
  }
  let sentCount = 0
  for (const post of approved) {
    const flag = post.channel === 'threads' ? env.THREADS_PUBLISH_ENABLED : env.INSTAGRAM_PUBLISH_ENABLED
    if (flag !== 'true') continue
    await publish({
      channel: post.channel, slug: post.slug, campaign: post.campaign,
      text: post.text, imageUrl: post.imageUrl, imageSha256: post.imageSha256,
      accountId: post.accountId, classification: post.classification,
      dateJst: post.dateJst, expiresAt: post.expiresAt, approved: true,
    })
    sentCount++
  }
  return { status: 'completed' as const, approvedCount: approved.length, sentCount }
}
