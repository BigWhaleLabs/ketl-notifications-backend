import { Context, Next } from 'koa'
import { forbidden } from '@hapi/boom'
import env from '@/helpers/env'

export default function authenticate(ctx: Context, next: Next) {
  if (env.PASSWORD !== ctx.headers.password) {
    throw forbidden()
  }
  return next()
}
