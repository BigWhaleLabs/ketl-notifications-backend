import { PostStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import { getItem, setItem } from 'node-persist'
import { getTokens } from '@/models/Token'
import feedsData from '@/helpers/feedsData'
import getIPFSContent from '@/helpers/getIPFSContent'
import isBanned from '@/helpers/isBannedPost'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

async function didSendPost(feedId: number, postId: number) {
  const sendedDate = await getItem(`post-${feedId}-${postId}`)
  return sendedDate !== undefined
}

export default async function sendPost(
  feedId: number,
  postId: number,
  [author, metadata]: PostStructOutput
) {
  if (await isBanned(feedId, postId)) return
  if (await didSendPost(feedId, postId)) return

  const feedName = feedsData[feedId]
  if (!feedName) {
    console.error('Feed not fount')
    return
  }
  const content = await getIPFSContent(structToCid(metadata))
  if (!content || !content.text) {
    console.error('Post data is empty')
    return
  }

  const authorUsername = generateRandomName(author)
  const tokens = await getTokens({ allPostsEnabled: true })

  await sendFirebaseNotification({
    body: content.text,
    feedId,
    postId,
    title: `@${authorUsername} posted at ${feedName}`,
    tokens,
  })

  await setItem(`post-${feedId}-${postId}`, Date.now())
}
