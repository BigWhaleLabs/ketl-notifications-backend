import { Body, Controller, Ctx, Get, Post, Put, Query } from 'amala'
import { Context } from 'vm'
import { Settings, SettingsModel, findOneOrCreate } from '@/models/Settings'
import { TokenModel } from '@/models/Token'
import { badRequest, internal } from '@hapi/boom'

@Controller('/settings')
export default class SettingsController {
  @Post('/')
  async addSettings(
    @Body({ required: true })
    { allPostsEnabled, hotPostsEnabled, repliesEnabled, token }: Settings,
    @Ctx() ctx: Context
  ) {
    try {
      const tokenRecord = await TokenModel.findOne({
        token,
      })
      if (!tokenRecord) return ctx.throw(badRequest("Can't find the token"))

      await SettingsModel.updateOne(
        { token: tokenRecord },
        {
          allPostsEnabled,
          hotPostsEnabled,
          repliesEnabled,
        },
        {
          upsert: true,
        }
      )

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't save the setting"))
    }
  }

  @Put('/')
  async updateSettings(
    @Body({ required: true })
    { allPostsEnabled, hotPostsEnabled, repliesEnabled, token }: Settings,
    @Ctx() ctx: Context
  ) {
    try {
      const tokenRecord = await TokenModel.findOne({
        token,
      })
      if (!tokenRecord) return ctx.throw(badRequest("Can't find the token"))

      await SettingsModel.updateOne(
        { token: tokenRecord },
        {
          allPostsEnabled,
          hotPostsEnabled,
          repliesEnabled,
        }
      )

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't save the setting"))
    }
  }

  @Get('/')
  async getData(@Query('token') token: string, @Ctx() ctx: Context) {
    try {
      const tokenRecord = await TokenModel.findOne({
        token,
      })
      if (!tokenRecord) return ctx.throw(badRequest("Can't find the token"))

      return findOneOrCreate(tokenRecord)
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't find the setting"))
    }
  }
}
