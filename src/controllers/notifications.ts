import { Controller, Flow, Get, Post, Query } from 'amala'
import { TokenModel } from '@/models/Token'
import { getLastTimeSentFromStorage } from '@/helpers/lastTimeSent'
import {
  processCommentsForNotifications,
  processPostsForNotifications,
} from '@/helpers/proccessBlocksForNotifications'
import authenticate from '@/helpers/authenticate'
import defaultProvider from '@/helpers/defaultProvider'
import getEvents from '@/helpers/getEventst'
import getFeedsContract from '@/helpers/getFeedsContract'
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
    const commentsSinceLastCheck = await getEvents(
      getFeedsContract.filters.CommentAdded(),
      currentBlockNumber ? currentBlockNumber + 1 : currentBlock,
      currentBlock
    )
    const postsSinceLastCheck = await getEvents(
      getFeedsContract.filters.PostAdded(),
      currentBlockNumber ? currentBlockNumber + 1 : currentBlock,
      currentBlock
    )

    const modifiedPostsSinceLastCheck =
      processPostsForNotifications(postsSinceLastCheck)

    const modifiedCommentSinceLastCheck = processCommentsForNotifications(
      commentsSinceLastCheck
    )

    return {
      currentBlock,
      modifiedCommentSinceLastCheck,
      modifiedPostsSinceLastCheck,
    }
  }
  @Get('/lastTimeSent')
  getLastTimeSent() {
    return getLastTimeSentFromStorage()
  }
}
