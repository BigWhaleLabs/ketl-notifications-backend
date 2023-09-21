import { Body, Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'
import { Context } from 'vm'
import { TokenModel } from '@/models/Token'
import { badRequest, internal } from '@hapi/boom'
import {
  createOrUpdateSettings,
  deleteSettings,
  findOneOrCreate,
} from '@/models/NotificationSettings'
import Settings from '@/validators/Settings'

@Controller('/settings')
export default class SettingsController {
  @Post('/:token')
  async addSettings(
    @Params('token') token: string,
    @Body({ required: true })
    body: Settings,
    @Ctx() ctx: Context
  ) {
    try {
      const { allPostsEnabled, hotPostsEnabled, repliesEnabled } = body
      const tokenRecord = await TokenModel.findOne({
        token,
      })
      if (!tokenRecord) return ctx.throw(badRequest("Can't find the token"))

      await createOrUpdateSettings(tokenRecord, {
        allPostsEnabled,
        hotPostsEnabled,
        repliesEnabled,
      })

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't save the setting"))
    }
  }

  @Put('/:token')
  async updateSettings(
    @Params('token') token: string,
    @Body({ required: true })
    body: Settings,
    @Ctx() ctx: Context
  ) {
    try {
      const { allPostsEnabled, hotPostsEnabled, repliesEnabled } = body
      const tokenRecord = await TokenModel.findOne({
        token,
      })
      if (!tokenRecord) return ctx.throw(badRequest("Can't find the token"))

      await createOrUpdateSettings(tokenRecord, {
        allPostsEnabled,
        hotPostsEnabled,
        repliesEnabled,
      })

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't save the setting"))
    }
  }

  @Delete('/:token')
  async deleteSettings(@Params('token') token: string, @Ctx() ctx: Context) {
    try {
      const tokenRecord = await TokenModel.findOne({
        token,
      })
      if (!tokenRecord) return ctx.throw(badRequest("Can't find the token"))

      await deleteSettings(tokenRecord)

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't save the setting"))
    }
  }

  @Get('/:token')
  async getData(@Params('token') token: string, @Ctx() ctx: Context) {
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