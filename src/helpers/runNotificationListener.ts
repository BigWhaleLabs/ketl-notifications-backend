import { TokenModel } from '@/models/Token'
import getObssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendGoogleNotification from '@/helpers/sendGoogleNotification'

const apnRegex = /^[a-f0-9]{64}$/

const obssContract = getObssContract()

const rootFeeds = {
  0: 't/dev',
  1: 't/startups',
  2: 't/ketlTeam',
} as { [key: number]: string }

obssContract.on('FeedPostAdded', async (feedId) => {
  const title = rootFeeds[feedId.toNumber()]
    ? `Someone posted at ${rootFeeds[feedId.toNumber()]}`
    : undefined
  const allTokens = await TokenModel.find()
  allTokens.forEach(async (token) => {
    try {
      const { token: deviceToken } = token
      // APN token
      if (apnRegex.test(deviceToken)) {
        await sendAppleNotification(deviceToken, title)
      } else {
        // FCM token
        await sendGoogleNotification(deviceToken, title)
      }
    } catch (err) {
      console.error(err)
    }
  })
})
