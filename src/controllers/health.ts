import { Context } from 'koa'
import { Controller, Ctx, Get } from 'amala'
import { internal } from '@hapi/boom'
import mongoose, { ConnectionStates } from 'mongoose'

@Controller('/health')
export default class HealthController {
  @Get('/')
  health(
    @Ctx()
    ctx: Context
  ) {
    if (mongoose.connection.readyState !== ConnectionStates.connected)
      ctx.throw(internal('Mongo instance is disconnected'))

    return 'ok'
  }
}
