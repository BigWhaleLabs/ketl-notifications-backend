import { TokenModel } from '@/models/Token'
import obssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendGoogleNotification from '@/helpers/sendGoogleNotification'

const apnRegex = /^[a-f0-9]{64}$/

const rootFeeds = {
  1: 't/startups',
  2: 't/ketlTeam',
} as { [key: number]: string }

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
