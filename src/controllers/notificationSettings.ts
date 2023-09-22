import { Body, Controller, Ctx, Get, Params, Post } from 'amala'
import { Context } from 'vm'
import {
  createOrUpdateSettings,
  findSettingsByToken,
} from '@/models/NotificationSettings'
import { internal } from '@hapi/boom'
import NotificationSettings from '@/validators/NotificationSettings'

@Controller('/notificationSettings')
export default class SettingsController {
  @Post('/')
  async addSettings(
    @Body({ required: true }) body: NotificationSettings,
    @Ctx() ctx: Context
  ) {
    try {
      await createOrUpdateSettings(body.token, body)

      return { success: true }
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't save push notifications setting"))
    }
  }

  @Get('/:token')
  getSettings(@Params('token') token: string, @Ctx() ctx: Context) {
    try {
      const result = findSettingsByToken({ token })
      return result
    } catch (e) {
      console.error(e)
      return ctx.throw(internal("Can't get user push notifications setting"))
    }
  }
}
