import { TokenModel } from '@/models/Token'
import env from '@/helpers/env'
import obssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendGoogleNotification from '@/helpers/sendGoogleNotification'

const prodFeeds = {
  1: 't/startups',
  2: 't/ketlTeam',
}

const apnRegex = /^[a-f0-9]{64}$/

const rootFeeds: { [key: number]: string } = env.isProduction
  ? prodFeeds
  : {
      0: 't/devFeed',
      ...prodFeeds,
    }

obssContract.on('FeedPostAdded', async (feedId) => {
  const title = rootFeeds[feedId.toNumber()]
    ? `Someone posted at ${rootFeeds[feedId.toNumber()]}`
    : undefined

  const allTokens = await TokenModel.find()

  for (const { token } of allTokens) {
    try {
      // APN token
      if (apnRegex.test(token)) {
        await sendAppleNotification(token, title)
      } else {
        // FCM token
        await sendGoogleNotification(token, title)
      }
    } catch (err) {
      console.error(err)
    }
  }
})
