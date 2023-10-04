import { CIDStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import TextProps from '@/models/TextProps'
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
  }: TextProps) => string | undefined,
  makeBody: ({
    author,
    extraText,
    feedName,
    text,
  }: TextProps) => string | undefined,
  feedId: number,
  postId: number,
  author: string,
  metadata: CIDStructOutput
) {
  const feedName = feedsData[feedId]
  if (!feedName) return
  const authorUsername = generateRandomName(author)
  const content = await getIPFSContent(structToCid(metadata))
  const title = makeTitle({ ...content, author: authorUsername, feedName })
  if (!title) return
  const body = makeBody({ ...content, author: authorUsername, feedName })

  await sendFirebaseNotification({
    body,
    feedId,
    postId: postId,
    title,
    tokens,
  })
}
