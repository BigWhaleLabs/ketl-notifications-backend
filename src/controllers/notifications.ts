import { CommentModel } from '@/models/Comment'
import { Controller, Flow, Get, Post, Query } from 'amala'
import { PostModel, defaultPostProjection } from '@/models/Post'
import { TokenModel } from '@/models/Token'
import { getLastTimeSentFromStorage } from '@/helpers/lastTimeSent'
import authenticate from '@/helpers/authenticate'
import defaultProvider from '@/helpers/defaultProvider'
import ketlAttestationContract from '@/helpers/getKetlAttestation'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'

@Controller('/notifications')
export default class NotificationsController {
  @Post('/waitlist')
  @Flow(authenticate)
  async onUpdateWaitlist() {
    const tokens = await TokenModel.find({ waitlist: true })
    const tokensToNotify = tokens.map(({ token }) => token).filter(Boolean)
    if (!tokensToNotify.length) return
    await sendFirebaseNotification({
      tokens: tokensToNotify,
      type: 'waitlist',
    })
  }

  @Get('/entanglement')
  async getEntanglement(@Query('entanglementType') entanglementType: string) {
    const countBN = await ketlAttestationContract.entanglementsCounts(
      entanglementType
    )
    const minimalCountBN =
      await ketlAttestationContract.minimumEntanglementCounts(entanglementType)
    return {
      count: countBN.toNumber(),
      minimalCount: minimalCountBN,
    }
  }

  @Get('/')
  async getData(@Query('currentBlockNumber') currentBlockNumber?: number) {
    const currentBlock = await defaultProvider.getBlockNumber()

    if (!currentBlockNumber)
      return {
        currentBlock,
        modifiedCommentSinceLastCheck: [],
        modifiedPostsSinceLastCheck: [],
      }

    const modifiedCommentSinceLastCheck = await CommentModel.find(
      {
        blockNumber: { $gt: currentBlockNumber, $lte: currentBlock },
      },
      defaultPostProjection
    )
    const modifiedPostsSinceLastCheck = await PostModel.find(
      {
        blockNumber: { $gt: currentBlockNumber, $lte: currentBlock },
      },
      defaultPostProjection
    )

    return {
      currentBlock,
      modifiedCommentSinceLastCheck: modifiedCommentSinceLastCheck.map(
        (comment) => comment.toObject({ virtuals: true })
      ),
      modifiedPostsSinceLastCheck: modifiedPostsSinceLastCheck.map((post) =>
        post.toObject({ virtuals: true })
      ),
    }
  }

  @Get('/lastTimeSent')
  getLastTimeSent() {
    return getLastTimeSentFromStorage()
  }
}
