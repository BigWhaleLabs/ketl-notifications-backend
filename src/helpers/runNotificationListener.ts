import { BigNumber } from 'ethers'
import { PostStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { getTokens } from '@/models/Token'
import { minimumNumberOfComments } from '@/data/hotPost'
import checkAndSendHotPost from '@/helpers/sendHotPost'
import getFeedsContract from '@/helpers/getFeedsContract'
import isBanned from '@/helpers/isBannedPost'
import ketlAttestationContract from '@/helpers/getKetlAttestation'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import sendPost from '@/helpers/sendPost'

ketlAttestationContract.on(
  'EntanglementRegistered',
  async (attestationType: BigNumber) => {
    try {
      const minimum = await ketlAttestationContract.minimumEntanglementCounts(
        attestationType
      )
      const current = await ketlAttestationContract.entanglementsCounts(
        attestationType
      )
      if (current.gt(minimum)) return
      const tokens = await getTokens()
      await sendFirebaseNotification({
        tokens,
        type: 'entanglement',
      })
    } catch (err) {
      console.error(err)
    }
  }
)

getFeedsContract.on(
  'CommentAdded',
  async (feedId: BigNumber, postId: BigNumber, commentId: BigNumber) => {
    try {
      const numberFeedId = feedId.toNumber()
      const numberPostId = postId.toNumber()
      const numberCommentId = commentId.toNumber()
      if (
        (await isBanned(numberFeedId, numberPostId)) ||
        (await isBanned(numberFeedId, numberPostId, numberCommentId))
      )
        return
      const tokens = await getTokens({ repliesEnabled: true })
      await sendFirebaseNotification({ tokens })

      if (numberCommentId !== minimumNumberOfComments) return
      await checkAndSendHotPost(numberFeedId, numberPostId)
    } catch (e) {
      console.error(e)
    }
  }
)

getFeedsContract.on(
  'PostAdded',
  async (feedId: BigNumber, postId: BigNumber, post: PostStructOutput) => {
    try {
      const numberFeedId = feedId.toNumber()
      const numberPostId = postId.toNumber()

      await sendPost(numberFeedId, numberPostId, post)
    } catch (e) {
      console.error(e)
    }
  }
)
