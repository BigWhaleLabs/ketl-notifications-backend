import { TokenModel } from '@/models/Token'
import getObssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendGoogleNotification from '@/helpers/sendGoogleNotification'

const apnRegex = /^[a-f0-9]{64}$/
const fcmRegex = /^[a-zA-Z0-9_-]{140,152}$/

const obssContract = getObssContract()

obssContract.on('FeedPostAdded', async () => {
  const allTokens = await TokenModel.find()
  allTokens.forEach(async (token) => {
    try {
      const { token: deviceToken } = token
      // APN token
      if (apnRegex.test(deviceToken)) {
        await sendAppleNotification(deviceToken)
      } else if (fcmRegex.test(deviceToken)) {
        // FCM token
        await sendGoogleNotification(deviceToken)
      }
    } catch (err) {
      console.error(err)
    }
  })
})
