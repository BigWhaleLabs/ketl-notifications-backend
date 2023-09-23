import { BigNumber } from 'ethers'
import { PostStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { getTokens } from '@/models/TokenWithSettings'
import { minimumNumberOfComments } from '@/data/hotPost'
import getFeedsContract from '@/helpers/getFeedsContract'
import isHotPost from '@/helpers/isHotPost'
import ketlAttestationContract from '@/helpers/getKetlAttestation'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import sendPostNotification from '@/helpers/sendPostNotification'

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

getFeedsContract.on(
  'CommentAdded',
  async (feedId: BigNumber, postId: BigNumber, commentId: BigNumber) => {
    try {
      const tokens = await getTokens({ repliesEnabled: true })
      await sendFirebaseNotification({ tokens })

      if (commentId.toNumber() !== minimumNumberOfComments) return
      const numberFeedId = feedId.toNumber()
      const numberPostId = postId.toNumber()

      const isHot = await isHotPost(numberFeedId, numberPostId)
      if (!isHot) return

      const post = await getFeedsContract.posts(numberFeedId, numberPostId)
      const hotPostTokens = await getTokens({ hotPostsEnabled: true })

      await sendPostNotification(
        hotPostTokens,
        ({ author, feedName }) => `🔥 Hot post by @${author} at ${feedName}`,
        numberFeedId,
        numberPostId,
        post.author,
        post.metadata
      )
    } catch (err) {
      console.error(err)
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

      const tokens = await getTokens({ allPostsEnabled: true })
      await sendPostNotification(
        tokens,
        ({ author, feedName }) => `@${author} posted at ${feedName}`,
        numberFeedId,
        numberPostId,
        author,
        metadata
      )
    } catch (err) {
      console.error(err)
    }
  }
)
