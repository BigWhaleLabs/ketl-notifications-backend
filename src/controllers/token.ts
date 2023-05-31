import { Body, Controller, Ctx, Delete, Get, Post, Query } from 'amala'
import { Context } from 'koa'
import { TokenModel } from '@/models/Token'
import { badRequest } from '@hapi/boom'
import {
  proccessCommentsForNotifications,
  proccessPostsForNotifications,
} from '@/helpers/proccessBlocksForNotifications'
import Token from '@/validators/Token'
import defaultProvider from '@/helpers/defaultProvider'
import getEvents from '@/helpers/getEventst'
import getFeedsContract from '@/helpers/getFeedsContract'

@Controller('/token')
export default class TokenController {
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

  @Post('/')
  async addToken(
    @Body({ required: true }) { token }: Token,
    @Ctx() ctx: Context
  ) {
    try {
      const previousToken = await TokenModel.findOne({
        token,
      })
      if (previousToken) return { success: true }

      await TokenModel.create({ token })

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(badRequest('Invalid signature'))
    }
  }

  @Delete('/')
  async deleteToken(
    @Query({ required: true })
    { token }: Token,
    @Ctx() ctx: Context
  ) {
    try {
      await TokenModel.deleteMany({ token })
      return { success: true }
    } catch {
      return ctx.throw(badRequest('Invalid signature'))
    }
  }
}
