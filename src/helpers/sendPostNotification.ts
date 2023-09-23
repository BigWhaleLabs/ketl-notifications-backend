import { CIDStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import { rootFeeds } from '@/helpers/feedsData'
import getIPFSContent from '@/helpers/getIPFSContent'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

export default async function sendPostNotification(
  tokens: string[],
  makeTitle: ({
    author,
    feedName,
  }: {
    author: string
    feedName: string
  }) => string,
  feedId: number,
  postId: number,
  author: string,
  metadata: CIDStructOutput
) {
  const feedName = rootFeeds[feedId]
  if (!feedName) return
  const authorUsername = generateRandomName(author)
  const title = makeTitle({ author: authorUsername, feedName })
  if (!title) return
  const body = await getIPFSContent(structToCid(metadata))

  await sendFirebaseNotification({
    body,
    feedId,
    postId: postId,
    title,
    tokens,
  })
}
