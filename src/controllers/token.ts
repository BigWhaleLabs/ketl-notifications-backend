import { Body, Controller, Ctx, Get, Params, Post, Put } from 'amala'
import { Context } from 'koa'
import {
  TokenModel,
  findSettingsByToken,
  updateTokenWithSettings,
} from '@/models/Token'
import { allDisabledNotificationSettings } from '@/models/NotificationSettings'
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

  @Post('/waitlist')
  async addWaitlistToken(
    @Body({ required: true }) body: TokenWithSettings,
    @Ctx() ctx: Context
  ) {
    const { token } = body
    if (!token) return ctx.throw(badRequest('No token'))
    const existingToken = await TokenModel.findOne({ token })
    if (existingToken) {
      existingToken.waitlist = true
      await existingToken.save()
      return { success: true }
    }
    const newToken = new TokenModel({ token, waitlist: true })
    await newToken.save()
    return { success: true }
  }

  @Put('/waitlist/:token')
  async markAsReceived(@Params('token') token: string, @Ctx() ctx: Context) {
    const tokenDoc = await TokenModel.findOne({ token })
    if (!tokenDoc) return ctx.throw(badRequest('Token not found'))
    tokenDoc.waitlist = undefined
    await tokenDoc.save()
    return { success: true }
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
      if (!result) return allDisabledNotificationSettings
      return result
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't get user push notifications setting"))
    }
  }
}
