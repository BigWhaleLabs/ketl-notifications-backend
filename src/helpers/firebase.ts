import * as admin from 'firebase-admin'
import { cwd } from 'process'
import { initializeApp } from 'firebase-admin/app'
import { resolve } from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(resolve(cwd(), 'firebase-account.json'))

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default app
