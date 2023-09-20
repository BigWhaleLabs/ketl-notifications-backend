import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import * as ratelimit from 'koa-ratelimit'
import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import { resolve } from 'path'
import env from '@/helpers/env'

const app = new Koa()
const db = new Map()

export default async function () {
  const router = new Router()
  await bootstrapControllers({
    app,
    basePath: '/',
    controllers: [resolve(__dirname, '../controllers/*')],
    disableVersioning: true,
    router,
  })
  app.use(cors({ origin: '*' }))
  app.use(
    ratelimit({
      db,
      disableHeader: false,
      driver: 'memory',
      duration: 1000,
      errorMessage: 'Too Many Requests',
      headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total',
      },
      id: (ctx) => ctx.ip,
      max: 30,
    })
  )
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  return new Promise<Server>((resolve, reject) => {
    const connection = app
      .listen(env.PORT)
      .on('listening', () => {
        console.log(`HTTP is listening on ${env.PORT}`)
        resolve(connection)
      })
      .on('error', reject)
  })
}
