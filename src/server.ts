import 'module-alias/register'
import 'source-map-support/register'

import '@/helpers/runNotificationListener'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Mongo connected')
  await runApp()
})()
