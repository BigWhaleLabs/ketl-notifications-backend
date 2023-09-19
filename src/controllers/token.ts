import { Body, Controller, Ctx, Delete, Post, Query } from 'amala'
import { Context } from 'koa'
import { TokenModel } from '@/models/Token'
import { badRequest } from '@hapi/boom'
import Token from '@/validators/Token'

@Controller('/token')
export default class TokenController {
  @Post('/')
  async addToken(@Body({ required: true }) body: Token, @Ctx() ctx: Context) {
    try {
      const token = body.token
      const previousToken = await TokenModel.findOne({ token })
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
    body: Token,
    @Ctx() ctx: Context
  ) {
    try {
      await TokenModel.deleteMany({ token: body.token })
      return { success: true }
    } catch {
      return ctx.throw(badRequest('Invalid signature'))
    }
  }
}
