import { Controller, Get, Query } from 'amala'
import { getLastTimeSent } from '@/helpers/lastTimeSent'
import {
  proccessCommentsForNotifications,
  proccessPostsForNotifications,
} from '@/helpers/proccessBlocksForNotifications'
import defaultProvider from '@/helpers/defaultProvider'
import getEvents from '@/helpers/getEventst'
import getFeedsContract from '@/helpers/getFeedsContract'
import ketlAttestationContract from '@/helpers/getKetlAttestation'

@Controller('/notifications')
export default class NotificationsController {
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
      proccessPostsForNotifications(postsSinceLastCheck)

    const modifiedCommentSinceLastCheck = proccessCommentsForNotifications(
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
    return getLastTimeSent()
  }
}
