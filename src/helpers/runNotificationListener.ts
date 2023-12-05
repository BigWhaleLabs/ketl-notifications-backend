import { BigNumber } from 'ethers'
import {
  CommentAddedEvent,
  PostAddedEvent,
  PostStructOutput,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { getTokens } from '@/models/Token'
import { minimumNumberOfComments } from '@/data/hotPost'
import { saveCommentEvent, savePostEvent } from '@/helpers/saveBlockchainEvents'
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
  async (
    feedId: BigNumber,
    postId: BigNumber,
    commentId: BigNumber,
    comment: PostStructOutput,
    commentEvent: CommentAddedEvent
  ) => {
    try {
      const numberFeedId = feedId.toNumber()
      const numberPostId = postId.toNumber()
      const numberCommentId = commentId.toNumber()
      const replyTo = comment.replyTo.toNumber()
      if (
        (await isBanned(numberFeedId, numberPostId)) ||
        (await isBanned(numberFeedId, numberPostId, replyTo))
      )
        return

      await saveCommentEvent(commentEvent)

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
  async (
    feedId: BigNumber,
    postId: BigNumber,
    post: PostStructOutput,
    _author: string,
    postEvent: PostAddedEvent
  ) => {
    try {
      const numberFeedId = feedId.toNumber()
      const numberPostId = postId.toNumber()

      await savePostEvent(postEvent)
      await sendPost(numberFeedId, numberPostId, post)
    } catch (e) {
      console.error(e)
    }
  }
)
