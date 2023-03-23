/* eslint-disable @typescript-eslint/no-unused-vars */
import { BigNumber, utils } from 'ethers'
import { Body, Controller, Ctx, Delete, Get, Post, Query } from 'amala'
import { Config, uniqueNamesGenerator } from 'unique-names-generator'
import { Context } from 'koa'
import { OBSSStorage } from '@big-whale-labs/obss-storage-contract'
import { OBSSStorage__factory } from '@big-whale-labs/obss-storage-contract'
import { TokenModel } from '@/models/Token'
import {
  TypedEvent,
  TypedEventFilter,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/common'
import { animalDictionary, colorDictionary } from '@/helpers/nameDictionary'
import { badRequest } from '@hapi/boom'
import { encode } from 'bs58'
import CID from '@/models/CID'
import Token from '@/validators/Token'
import defaultProvider from '@/helpers/defaultProvider'
import generateRandomName from '@/helpers/generateRandomName'
import getEvents from '@/helpers/getEventst'
import obssContract from '@/helpers/getObssContract'
import parsePostLogData from '@/helpers/parsePostLogData'
import proccessBlocksForNotifications from '@/helpers/proccessBlocksForNotifications'
import structToCid from '@/helpers/structToCid'

@Controller('/token')
export default class TokenController {
  @Get('/')
  async getData(@Query('currentBlockNumber') currentBlockNumber?: number) {
    const currentBlock = await defaultProvider.getBlockNumber()
    const postsSinceLastCheck = await getEvents(
      obssContract.filters.FeedPostAdded(),
      // lastParsedBlock,
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
      currentBlock,
      postsSinceLastCheck: modifiedPostsSinceLastCheck,
      allTimePosts: modifiedAllTimePosts,
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
