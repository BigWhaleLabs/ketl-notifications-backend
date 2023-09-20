import { Body, Controller, Ctx, Delete, Params, Post, Put, Query } from 'amala'
import { Context } from 'koa'
import { TokenModel } from '@/models/Token'
import { badRequest, internal } from '@hapi/boom'
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
      return ctx.throw(internal("Can't save token"))
    }
  }

  @Put('/:token')
  async replaceToken(
    @Params('token') oldToken: string,
    @Body({ required: true }) { token }: Token,
    @Ctx() ctx: Context
  ) {
    try {
      const previousToken = await TokenModel.findOne({
        token: oldToken,
      })
      if (!previousToken) return ctx.throw(badRequest("Can't find the token"))

      previousToken.token = token
      await previousToken.save()

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't update token"))
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
      return ctx.throw(internal("Can't delete token"))
    }
  }
}
