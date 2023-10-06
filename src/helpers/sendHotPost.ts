import { getItem, setItem } from 'node-persist'
import { getTokens } from '@/models/Token'
import getFeedsContract from '@/helpers/getFeedsContract'
import getIPFSContent from '@/helpers/getIPFSContent'
import isHotPost from '@/helpers/isHotPost'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

async function isSendedHotPost(feedId: number, postId: number) {
  const sendedDate = await getItem(`hot-post-${feedId}-${postId}`)
  return sendedDate !== undefined
}

export default async function checkAndSendHotPost(
  feedId: number,
  postId: number
) {
  if (await isSendedHotPost(feedId, postId)) return

  const isHot = await isHotPost(feedId, postId)
  if (!isHot) return

  const post = await getFeedsContract.posts(feedId, postId)
  const content = await getIPFSContent(structToCid(post.metadata))
  if (!content || !content.text) {
    console.error('Post data is empty')
    return
  }
  const hotPostTokens = await getTokens({ hotPostsEnabled: true })

  await sendFirebaseNotification({
    body: content.extraText,
    feedId,
    postId,
    title: `🔥 trending now: ${content.text}`,
    tokens: hotPostTokens,
  })

  await setItem(`hot-post-${feedId}-${postId}`, Date.now())
}
