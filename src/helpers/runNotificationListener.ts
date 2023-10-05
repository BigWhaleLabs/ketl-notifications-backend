import { BigNumber } from 'ethers'
import { PostStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import { getTokens } from '@/models/Token'
import { minimumNumberOfComments } from '@/data/hotPost'
import checkAndSendHotPost from '@/helpers/sendHotPost'
import feedsData from '@/helpers/feedsData'
import getFeedsContract from '@/helpers/getFeedsContract'
import getIPFSContent from '@/helpers/getIPFSContent'
import ketlAttestationContract from '@/helpers/getKetlAttestation'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

ketlAttestationContract.on('EntanglementRegistered', async () => {
  try {
    const tokens = await getTokens()
    await sendFirebaseNotification({
      tokens,
      type: 'entanglement',
    })
  } catch (err) {
    console.error(err)
  }
})

getFeedsContract.on(
  'CommentAdded',
  async (feedId: BigNumber, postId: BigNumber, commentId: BigNumber) => {
    try {
      const tokens = await getTokens({ repliesEnabled: true })
      await sendFirebaseNotification({ tokens })

      if (commentId.toNumber() !== minimumNumberOfComments) return
      const numberFeedId = feedId.toNumber()
      const numberPostId = postId.toNumber()

      await checkAndSendHotPost(numberFeedId, numberPostId)
    } catch (e) {
      console.error(e)
    }
  }
)

getFeedsContract.on(
  'PostAdded',
  async (
    feedId: BigNumber,
    postId: BigNumber,
    [author, metadata]: PostStructOutput
  ) => {
    try {
      const numberFeedId = feedId.toNumber()
      const numberPostId = postId.toNumber()

      const feedName = feedsData[numberFeedId]
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
        feedId: numberFeedId,
        postId: numberPostId,
        title: `@${authorUsername} posted at ${feedName}`,
        tokens,
      })
    } catch (e) {
      console.error(e)
    }
  }
)
