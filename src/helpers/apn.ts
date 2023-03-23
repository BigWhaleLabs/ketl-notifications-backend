import { Provider } from '@parse/node-apn'
import { cwd } from 'process'
import { resolve } from 'path'
import env from '@/helpers/env'

const pathToKey = resolve(cwd(), 'APN.p8')

export default new Provider({
  token: {
    key: pathToKey,
    keyId: env.APN_KEY_ID,
    teamId: env.APN_TEAM_ID,
  },
  production: false,
})
