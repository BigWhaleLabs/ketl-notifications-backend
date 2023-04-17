import { Body, Controller, Ctx, Delete, Get, Post, Query } from 'amala'
import { Context } from 'koa'
import { TokenModel } from '@/models/Token'
import { badRequest } from '@hapi/boom'
import Token from '@/validators/Token'
import defaultProvider from '@/helpers/defaultProvider'
import getEvents from '@/helpers/getEventst'
import obssContract from '@/helpers/getObssContract'
import proccessBlocksForNotifications from '@/helpers/proccessBlocksForNotifications'

@Controller('/token')
export default class TokenController {
  @Get('/')
  async getData(@Query('currentBlockNumber') currentBlockNumber?: number) {
    const currentBlock = await defaultProvider.getBlockNumber()
    const postsSinceLastCheck = await getEvents(
      obssContract.filters.FeedPostAdded(),
      currentBlockNumber || currentBlock,
      currentBlock
    )
    const allTimePosts = await getEvents(
      obssContract.filters.FeedPostAdded(),
      undefined,
      currentBlock
    )
    const modifiedPostsSinceLastCheck =
      proccessBlocksForNotifications(postsSinceLastCheck)

    const modifiedAllTimePosts = proccessBlocksForNotifications(allTimePosts)

    return {
      allTimePosts: modifiedAllTimePosts,
      currentBlock,
      postsSinceLastCheck: modifiedPostsSinceLastCheck,
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
