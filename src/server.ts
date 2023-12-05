import 'module-alias/register'
import 'source-map-support/register'

import '@/helpers/runNotificationListener'
import { init as initStorage } from 'node-persist'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import saveBlockchainEvents from '@/helpers/saveBlockchainEvents'

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Mongo connected')
  console.log('Starting storage')
  await initStorage()
  console.log('Storage connected')
  await runApp()
  await saveBlockchainEvents()
})()
