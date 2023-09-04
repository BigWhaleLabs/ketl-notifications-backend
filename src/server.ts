import 'module-alias/register'
import 'source-map-support/register'

import '@/helpers/runNotificationListener'
import * as storage from 'node-persist'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Mongo connected')
  console.log('Starting storage')
  await storage.init()
  console.log('Storage connected')
  await runApp()
})()
