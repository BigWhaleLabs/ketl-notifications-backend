import { Body, Controller, Ctx, Get, Params, Post, Put } from 'amala'
import { Context } from 'koa'
import {
  TokenModel,
  findSettingsByToken,
  updateTokenWithSettings,
} from '@/models/TokenWithSettings'
import { badRequest, internal } from '@hapi/boom'
import TokenWithSettings from '@/validators/TokenWithSettings'

@Controller('/token')
export default class TokenController {
  @Post('/')
  async addToken(
    @Body({ required: true }) body: TokenWithSettings,
    @Ctx() ctx: Context
  ) {
    try {
      const { allPostsEnabled, hotPostsEnabled, repliesEnabled, token } = body
      await updateTokenWithSettings(token, {
        allPostsEnabled,
        hotPostsEnabled,
        repliesEnabled,
      })

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't save token"))
    }
  }

  @Put('/:oldToken')
  async replaceToken(
    @Params('oldToken') oldToken: string,
    @Body({ required: true }) body: TokenWithSettings,
    @Ctx() ctx: Context
  ) {
    try {
      const previousData = await TokenModel.findOne({ token: oldToken })
      if (!previousData?.token)
        return ctx.throw(badRequest("Can't find the token"))

      previousData.token = body.token
      await previousData.save()

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't update token"))
    }
  }

  @Get('/:token')
  async getSettings(@Params('token') token: string, @Ctx() ctx: Context) {
    try {
      const result = await findSettingsByToken(token)
      if (!result?.token) throw "Can't find user data"
      return result
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't get user push notifications setting"))
    }
  }
}
