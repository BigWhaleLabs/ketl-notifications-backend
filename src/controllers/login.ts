import { Body, Controller, Ctx, Post } from 'amala'
import { Context } from 'koa'
import { TokenModel } from '@/models/Token'
import { badRequest } from '@hapi/boom'
import { verifyMessage } from 'ethers'
import Signature from '@/validators/Signature'
import Token from '@/validators/Token'

@Controller('/token')
export default class LoginController {
  @Post('/')
  async addToken(
    @Body({ required: true }) { token, message, signature }: Signature & Token,
    @Ctx() ctx: Context
  ) {
    try {
      const address = verifyMessage(message, signature)
      const existingToken = await TokenModel.find({ token, address })
      if (!existingToken) {
        await TokenModel.create({ token, address })
      }
      return { success: true }
    } catch {
      return ctx.throw(badRequest('Invalid signature'))
    }
  }
}
