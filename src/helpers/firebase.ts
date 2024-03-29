import * as admin from 'firebase-admin'
import { cwd } from 'process'
import { initializeApp } from 'firebase-admin/app'
import { resolve } from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(resolve(cwd(), 'firebase-account.json'))

export default initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
