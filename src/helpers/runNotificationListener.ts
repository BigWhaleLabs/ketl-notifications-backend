import { TokenModel } from '@/models/Token'
import obssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendGoogleNotification from '@/helpers/sendGoogleNotification'

const apnRegex = /^[a-f0-9]{64}$/
const notificationInterval = 30 * 60 * 1000 // 30 minutes in milliseconds

const rootFeeds = {
  1: 't/startups',
  2: 't/ketlTeam',
} as { [key: number]: string }

obssContract.on('FeedPostAdded', async (feedId) => {
  const currentTime = new Date()
  const title = rootFeeds[feedId.toNumber()]
    ? `Someone posted at ${rootFeeds[feedId.toNumber()]}`
    : undefined
  const allTokens = await TokenModel.find()

  for (const tokenDoc of allTokens) {
    try {
      const { token, lastSentTime } = tokenDoc

      if (
        !lastSentTime ||
        currentTime.getTime() - lastSentTime.getTime() >= notificationInterval
      ) {
        // APN token
        if (apnRegex.test(token)) {
          await sendAppleNotification(token, title)
        } else {
          // FCM token
          await sendGoogleNotification(token, title)
        }

        // Update lastSentTime in the database
        tokenDoc.lastSentTime = currentTime
        await tokenDoc.save()
      }
    } catch (err) {
      console.error(err)
    }
  }
})
