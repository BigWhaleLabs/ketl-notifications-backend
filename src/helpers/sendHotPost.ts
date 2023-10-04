import { getTokens } from '@/models/Token'
import getFeedsContract from '@/helpers/getFeedsContract'
import isHotPost from '@/helpers/isHotPost'
import sendPostNotification from '@/helpers/sendPostNotification'

export default async function checkAndSendHotPost(
  feedId: number,
  postId: number
) {
  const isHot = await isHotPost(feedId, postId)
  if (!isHot) return

  const post = await getFeedsContract.posts(feedId, postId)
  const hotPostTokens = await getTokens({ hotPostsEnabled: true })

  await sendPostNotification(
    hotPostTokens,
    ({ text }) => `🔥 trending now: ${text}`,
    ({ extraText }) => extraText,
    feedId,
    postId,
    post.author,
    post.metadata
  )
}
