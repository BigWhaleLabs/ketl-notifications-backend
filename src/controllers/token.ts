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
import Token from '@/validators/Token'
import defaultProvider from '@/helpers/defaultProvider'
import obssContract from '@/helpers/getObssContract'

const contractCreationBlock = 32269128

type CID = OBSSStorage.CIDStructOutput
export function parsePostLogData({
  data,
  topics,
}: {
  data: string
  topics: string[]
}) {
  const transferEventInterface = new utils.Interface(OBSSStorage__factory.abi)
  return transferEventInterface.parseLog({ data, topics })
}

function getEvents<TEvent extends TypedEvent>(
  filter: TypedEventFilter<TEvent>,
  startingBlock?: number,
  toBlock?: number
) {
  return obssContract.queryFilter(
    filter,
    startingBlock || contractCreationBlock,
    toBlock || 'latest'
  )
}

function structToCid(struct: CID) {
  if (struct.size === 0) return undefined

  // cut off leading "0x"
  const hashBytes = Buffer.from(struct.digest.slice(2), 'hex')

  // prepend hashFunction and digest size
  const multihashBytes = Buffer.alloc(2 + hashBytes.length)
  multihashBytes[0] = struct.hashFunction
  multihashBytes[1] = struct.size
  multihashBytes.set(hashBytes, 2)

  return encode(multihashBytes)
}

function generateRandomName(address: string) {
  const customConfig: Config = {
    dictionaries: [animalDictionary, colorDictionary],
    length: 2,
    style: 'capital',
    separator: '',
    seed: address,
  }
  return uniqueNamesGenerator(customConfig)
}

@Controller('/token')
export default class TokenController {
  @Get('/')
  async getData(@Query('currentBlockNumber') currentBlockNumber?: number) {
    console.log(currentBlockNumber)
    const currentBlock = await defaultProvider.getBlockNumber()
    console.log(currentBlock)
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
    const modifiedPostsSinceLastCheck = postsSinceLastCheck
      .map(({ data, topics }) => parsePostLogData({ data, topics }))
      .map(
        ({ args }) => args as [BigNumber, BigNumber, [string, CID, BigNumber]]
      )
      .map(([idFeed, postId, [author, metadata, commentFeedId]]) => {
        return [
          idFeed.toString(),
          postId.toString(),
          [
            author,
            structToCid(metadata),
            commentFeedId,
            generateRandomName(author),
          ],
        ]
      })

    const modifiedAllTimePosts = allTimePosts
      .map(({ data, topics }) => parsePostLogData({ data, topics }))
      .map(
        ({ args }) => args as [BigNumber, BigNumber, [string, CID, BigNumber]]
      )
      .map(([idFeed, postId, [author, metadata, commentFeedId]]) => {
        return [
          idFeed.toString(),
          postId.toString(),
          [
            author,
            structToCid(metadata),
            commentFeedId.toString(),
            generateRandomName(author),
          ],
        ]
      })
    console.log(modifiedAllTimePosts.splice(0, 1))
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
