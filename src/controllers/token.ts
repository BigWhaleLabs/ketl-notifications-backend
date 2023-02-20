import { Body, Controller, Ctx, Delete, Post } from 'amala'
import { Context } from 'koa'
import { TokenModel } from '@/models/Token'
import { badRequest } from '@hapi/boom'
import { verifyMessage } from 'ethers'
import Signature from '@/validators/Signature'
import Token from '@/validators/Token'

@Controller('/token')
export default class TokenController {
  @Post('/')
  async addToken(
    @Body({ required: true }) { token, message, signature }: Signature & Token,
    @Ctx() ctx: Context
  ) {
    try {
      const address = verifyMessage(message, signature)
      const previousToken = await TokenModel.find({
        token,
        address: { $ne: address },
      })
      if (previousToken) {
        await TokenModel.deleteMany(previousToken)
      }
      const existingToken = await TokenModel.find({ token, address })
      if (!existingToken) {
        await TokenModel.create({ token, address })
      }
      return { success: true }
    } catch {
      return ctx.throw(badRequest('Invalid signature'))
    }
  }

  @Delete('/')
  async deleteToken(
    @Body({ required: true }) { token, message, signature }: Signature & Token,
    @Ctx() ctx: Context
  ) {
    try {
      const address = verifyMessage(message, signature)
      await TokenModel.deleteMany({ token, address })
      return { success: true }
    } catch {
      return ctx.throw(badRequest('Invalid signature'))
    }
  }
}
