import { getItem, setItem } from 'node-persist'
import { getTokens } from '@/models/Token'
import getFeedsContract from '@/helpers/getFeedsContract'
import getIPFSContent from '@/helpers/getIPFSContent'
import isBanned from '@/helpers/isBannedPost'
import isHotPost from '@/helpers/isHotPost'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

async function didSendHotPost(feedId: number, postId: number) {
  const sendedDate = await getItem(`hot-post-${feedId}-${postId}`)
  return sendedDate !== undefined
}

export default async function checkAndSendHotPost(
  feedId: number,
  postId: number
) {
  if (await isBanned(feedId, postId)) return
  if (await didSendHotPost(feedId, postId)) return

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
    body: content.text,
    feedId,
    postId,
    title: `🔥 trending now`,
    tokens: hotPostTokens,
  })

  await setItem(`hot-post-${feedId}-${postId}`, Date.now())
}
