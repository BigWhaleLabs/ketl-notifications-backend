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
      if (!tokenRecord) return ctx.throw(badRequest(`Can't find token`))

      const settings = await SettingsModel.findOne({
        token: tokenRecord,
      })
      if (settings) return { success: true }

      await SettingsModel.create({
        allPostsEnabled,
        hotPostsEnabled,
        repliesEnabled,
        token,
      })

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal(`Can't save setting`))
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
      if (!tokenRecord) return ctx.throw(badRequest(`Can't find token`))

      await SettingsModel.updateMany(
        { token },
        {
          allPostsEnabled,
          hotPostsEnabled,
          repliesEnabled,
        }
      )

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal(`Can't save setting`))
    }
  }

  @Get('/')
  async getData(@Query('token') token: string, @Ctx() ctx: Context) {
    try {
      const tokenRecord = await TokenModel.findOne({
        token,
      })
      if (!tokenRecord) return ctx.throw(badRequest(`Can't find token`))

      return findOneOrCreate(tokenRecord)
    } catch (e) {
      console.error(e)
      return ctx.throw(internal(`Can't save token`))
    }
  }
}
