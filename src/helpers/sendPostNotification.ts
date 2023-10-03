import { CIDStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import feedsData from '@/helpers/feedsData'
import getIPFSContent from '@/helpers/getIPFSContent'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

export default async function sendPostNotification(
  tokens: string[],
  makeTitle: ({
    author,
    extraText,
    feedName,
    text,
  }: {
    author: string
    feedName: string
    text?: string
    extraText?: string
  }) => string | undefined,
  makeBody: ({
    author,
    extraText,
    feedName,
    text,
  }: {
    author: string
    feedName: string
    text?: string
    extraText?: string
  }) => string | undefined,
  feedId: number,
  postId: number,
  author: string,
  metadata: CIDStructOutput
) {
  const feedName = feedsData[feedId]
  if (!feedName) return
  const authorUsername = generateRandomName(author)
  const content = await getIPFSContent(structToCid(metadata))
  const title = makeTitle({ author: authorUsername, feedName, ...content })
  if (!title) return
  const body = makeBody({ author: authorUsername, feedName, ...content })

  await sendFirebaseNotification({
    body,
    feedId,
    postId: postId,
    title,
    tokens,
  })
}
