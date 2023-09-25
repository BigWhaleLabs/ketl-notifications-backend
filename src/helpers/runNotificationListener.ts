import { BigNumber } from 'ethers'
import { PostStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import { getTokens } from '@/models/TokenWithSettings'
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
      entanglement: true,
      tokens,
    })
  } catch (err) {
    console.error(err)
  }
})

getFeedsContract.on('CommentAdded', async () => {
  try {
    const tokens = await getTokens({ repliesEnabled: false })
    await sendFirebaseNotification({ tokens })
  } catch (err) {
    console.error(err)
  }
})

getFeedsContract.on(
  'PostAdded',
  async (
    feedId: BigNumber,
    postId: BigNumber,
    [author, metadata]: PostStructOutput
  ) => {
    try {
      const numberFeedId = feedId.toNumber()
      const feedName = feedsData[numberFeedId]
      if (!feedName) return
      const title = `@${generateRandomName(author)} posted at ${feedName}`
      if (!title) return
      const body = await getIPFSContent(structToCid(metadata))

      const tokens = await getTokens({ allPostsEnabled: false })

      await sendFirebaseNotification({
        body,
        feedId: numberFeedId,
        postId: postId.toNumber(),
        title,
        tokens,
      })
    } catch (err) {
      console.error(err)
    }
  }
)
